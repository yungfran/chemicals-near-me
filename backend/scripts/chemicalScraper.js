const rp = require('request-promise');
const { isObject } = require('util');
var fs = require('fs');
var epa_data = fs.readFileSync("epa_data.json", "utf8");
var epa_data_parsed = JSON.parse(epa_data);

chemicalSet = new Set();
duplicateChemicals = new Set();
badRequestChemicals = new Set();

//Adding all chemicals to a set -> convert to list removes duplicates
for (var i = 0; i < epa_data_parsed.length; i++){
	curr_site = epa_data_parsed[i];
	chemicals = curr_site.CHEMICALS
	for(var j = 0; j < chemicals.length ; j++){
        chemicalSet.add(chemicals[j]);
	}
}
//chemicalNames = ["BENZO(B)FLUORANTHENE"];
chemicalNames = Array.from(chemicalSet);

// 595 Unique Chemicals
// 435 Successful 
// 215 Chemicals have all the data
// 43 Of which are simple compounds or elements -> Nothing besides elemental information

// Different chemicals miss different fields
// If the field is a chemical property, it'll be easier to get Just scrape another website
    // If the field is like uses, or hazards statements, should probably ditch it, rather than trying to
    // find it elsehwere
    // Density is hard to s



//const url = 'https://pubchem.ncbi.nlm.nih.gov/compound/7845.html'
//img url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/PNG?record_type=3d&image_size=large'
CELSIUS_REFERENCE_NUMBER = 27;
DENSITY_25CELSIUS_REFERENCE_NUMBER = 38;
CAMEO_CHEMICALS_CAS_REFERENCE = 1;

seenChemicals = new Set(); //Stored by their Pubchem CID
chemicalNameToObject = new Map(); //Stores chemical : filled out json
chemicalNameToInitialJSON = new Map(); //Stores chemical : json with pubchem id, molecular weight, chemical formula
allChemicals = []

NUM_PROPERTIES


// Call the asynchronous function chemToJSON, after we get a response, use all the jsons to update
// the chemical objects created in setupChemicalObjects
// Number of elements in an object: Object.keys(OBJECT_TO_CHECK).length
allChemicalJSONS = chemToJSON() 
                                .then(async chemicalJSONS => {
                                    await updateAllChemicals();
                                    //console.log(JSON.stringify(allChemicals))
                                    //console.log(JSON.stringify(allChemicals,null,'\t')) //logs all chemical jsons that are valid
                                    goodChemicals = [];
                                    for(var i = 0; i < allChemicals.length; i++){
                                        if(Object.keys(allChemicals[i]).length === NUM_PROPERTIES){
                                            goodChemicals.push(allChemicals[i]);
                                        }
                                    }
                                    //console.log(JSON.stringify(allChemicals,null,'\t')); Use this console log if we're not removing results with missing data
                                    console.log(JSON.stringify(goodChemicals,null,'\t'));
                                });

                                    

// This is the initial asyc call
// Each chemical will have their api pulled. We await each the json for each chemical
// Return all the chemicals at the end
async function chemToJSON()
{
    chemicalJSONS = [];
    for(let i = 0; i < chemicalNames.length; i++){
        currChemical = chemicalNames[i];
        chemObj = { //Create object for chemical
            name : currChemical //Add name to object
        }

        chemicalJSON = await getOneChemicalJSON(currChemical) //Get initial JSON from API #1
        if(chemicalJSON != -1){
            let currCID = chemicalJSON.PropertyTable.Properties[0].CID;
            if(!seenChemicals.has(currCID)){ //Haven't Seen this chemical yet
                chemicalNameToObject.set(currChemical,chemObj);  //Place object in map
                chemicalNameToInitialJSON.set(currChemical,chemicalJSON); //Place initial JSON in map
                seenChemicals.add(currCID);
            } else {
                duplicateChemicals.add(currChemical);
                //console.log("ALREADY SEEN THIS CHEMICAL: " +  currCID);
            }
        } else {
            badRequestChemicals.add(currChemical);
        }
    }
    return chemicalJSONS;
}

//Returns the JSON object for one Chemical
async function getOneChemicalJSON(chemical)
{
    let URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + chemical + "/property/MolecularFormula,MolecularWeight/JSON";
    try{
        response = await rp(URL)
        return JSON.parse(response);
    } catch (err)
    {
        return -1;
    }
    
    
}

//Go through each chemical and 
async function updateAllChemicals()
{
    for(let i = 0; i < chemicalNames.length; i++){
        currChemical = chemicalNames[i];
        chemObject = chemicalNameToObject.get(currChemical); //Get Object to populate with API#2 data
        currJSON = chemicalNameToInitialJSON.get(currChemical); //Get the JSON from the initial API#1 call
        if(currJSON != undefined){ // IMPORTANT: ONLY POPULATE VALID CHEMICALS
            finalChemJSON = await populateChemicalObject(chemObject,currJSON);
            allChemicals.push(finalChemJSON);
        } else {
            badRequestChemicals.add(currChemical);
        }
    }
}



async function populateChemicalObject(chemObject, JSONresponse)
{
    let data = JSONresponse.PropertyTable.Properties[0]

    pubchemID = data.CID
    
    chemObject.chemical_formula = data.MolecularFormula;
    chemObject.pubchem_id = pubchemID;
    chemObject.molecular_weight = data.MolecularWeight;
    chemObject.diagram_url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/'+pubchemID+'/PNG?record_type=3d&image_size=large';
    chemObject.pubchem_url = 'https://pubchem.ncbi.nlm.nih.gov/compound/' +pubchemID

    let pageDataURL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/"+pubchemID+"/JSON/";
    response = await rp(pageDataURL) 
            pageData = JSON.parse(response).Record
            dataSections = pageData.Section; //"Names and Identifiers is a data section"
            dataSections.forEach( dataSection =>{

                if(dataSection.TOCHeading === 'Names and Identifiers')
                {
                    dataSection.Section.forEach( subSection => {
                        if(subSection.TOCHeading === "Record Description"){
                            subSection.Information.forEach( dataEntry => {
                                if(dataEntry.Description === "Physical Description"){
                                    DESCRIPTION = dataEntry.Value.StringWithMarkup[0].String;
                                    chemObject.description = DESCRIPTION;
                                }
                            })
                        } 
                        if(subSection.TOCHeading === "Other Identifiers"){
                            subSection.Section.forEach( dataEntry => {
                                if(dataEntry.TOCHeading === "CAS"){
                                    dataEntry.Information.forEach( identifier => {
                                        if(identifier.ReferenceNumber === CAMEO_CHEMICALS_CAS_REFERENCE){
                                            CAS = identifier.Value.StringWithMarkup[0].String
                                            chemObject.cas_num = CAS;
                                        }
                                    })

                                }
                            })
                        }
                    })
                }


                else if(dataSection.TOCHeading === 'Chemical and Physical Properties'){ //Look in Chemical and Physical Propeties Section
                    
                    dataSection.Section.forEach ( subSection => { 

                        if(subSection.TOCHeading === 'Experimental Properties'){ // Contains Experimental Properties or Computed Properties
                            
                            subSection.Section.forEach (dsds => {
                                if(dsds.TOCHeading === 'Boiling Point'){
                                    dsds.Information.forEach( dataSource => { 
                                        if(dataSource.Value.StringWithMarkup === undefined){
                                            //console.log(chemObject.name + " IS UNDEFINED");
                                        }
                                        else 
                                        {
                                            (dataSource.Value.StringWithMarkup != undefined)
                                            BOILING_POINT = dataSource.Value.StringWithMarkup[0].String;
                                            if(BOILING_POINT.includes("°C")){ //Search for a dataSource that has the right info
                                                if(chemObject.BoilingPoint === undefined){ //Could have multiple results with the same data format, but different data, just add the first match
                                                    chemObject.boiling_point = BOILING_POINT;
                                                }
                                            }
                                        } 
                                    })
                                } 

                                if (dsds.TOCHeading === 'Melting Point'){
                                        dsds.Information.forEach( dataSource => {
                                            if(dataSource.Value.StringWithMarkup === undefined){

                                            } else {
                                                MELTING_POINT = dataSource.Value.StringWithMarkup[0].String;
                                                if(MELTING_POINT.includes("°C")){
                                                    if(chemObject.MeltingPoint === undefined){
                                                        chemObject.melting_point = MELTING_POINT;
                                                    }
                                                }
                                            }
                                        })
                                } 
                                
                                if (dsds.TOCHeading === 'Density'){
                                    dsds.Information.forEach( dataSource => {
                                        if(dataSource.Value.StringWithMarkup === undefined){

                                        } else {
                                            DENSITY = dataSource.Value.StringWithMarkup[0].String
                                            if(DENSITY.includes("°C")){ //First density in celsius
                                                if(chemObject.Density === undefined){
                                                    chemObject.density = DENSITY;
                                                }
                                            }
                                        }
                                    })
                            }})
                        }
                    })
                }


                else if(dataSection.TOCHeading === 'Pharmacology and Biochemistry'){ //Pharmacology and Biochemistry Section
                        dataSection.Section.forEach (subSection => {
                            if(subSection.TOCHeading === 'Pharmacology'){ //Pharmacology Subsection
                                subSection.Information.forEach(dataEntry => {
                                    if(dataEntry.Name === 'Pharmacology'){
                                        if(dataEntry.Value.StringWithMarkup === undefined){
                                        } else {
                                            PHARMACOLOGY = dataEntry.Value.StringWithMarkup[0].String
                                            chemObject.pharmacology = PHARMACOLOGY;
                                        }
                                    }
                                })
                            }
                        })
                }

                else if(dataSection.TOCHeading === "Use and Manufacturing"){
                    dataSection.Section.forEach( subSection => {
                        if(subSection.TOCHeading === "Use Classification"){
                            Uses = []
                            chemObject.uses = Uses;
                            subSection.Information.forEach( dataEntry => {
                                if(dataEntry.Value.StringWithMarkup === undefined){

                                } else {
                                    USE = dataEntry.Value.StringWithMarkup[0].String;
                                    Uses.push(USE);
                                }
                            })
                        }
                    })
                }
                
                else if(dataSection.TOCHeading === "Safety and Hazards"){
                    dataSection.Section.forEach (subSection => {
                        if(subSection.TOCHeading == "Hazards Identification"){
                            subSection.Section.forEach( dataEntry => {
                                if(dataEntry.TOCHeading === "GHS Classification"){ 
                                    dataEntry.Information.forEach( dataPoint => {

                                        if(dataPoint.Name === "Pictogram(s)")
                                        { 
                                            if(dataPoint.Value.StringWithMarkup === undefined){

                                            } else {
                                                HealthHazards = [];
                                                chemObject.hazards = HealthHazards;
                                                hazards = dataPoint.Value.StringWithMarkup[0].Markup;
                                                hazards.forEach( hazard => { //Have a bunch of hazards, make an object for each hazard, store in an array
                                                    hazardObject = {         // chemObject stores this array
                                                        type : hazard.Extra,
                                                        svgURL : hazard.URL
                                                    }
                                                    HealthHazards.push(hazardObject);
                                                })
                                            }
                                        } 
                                        
                                        else if (dataPoint.Name === "GHS Hazard Statements")
                                        {
                                            HazardStatements = [];
                                            chemObject.hazard_statements = HazardStatements;
                                            hazards = dataPoint.Value.StringWithMarkup; //Array with hazard statements
                                            hazards.forEach( hazard => {
                                                hazardStatement = {
                                                    statement : hazard.String
                                                }
                                                HazardStatements.push(hazardStatement);
                                            })
                                        }
                                        
                                    })
                                }
                            })
                        }
                    })
                }

                else if(dataSection.TOCHeading === "Toxicity"){
                    dataSection.Section.forEach (dataSubSection => {
                        if(dataSubSection.TOCHeading === "Toxicological Information"){
                            ExposureEffects = {};
                            
                            exposureEffects = dataSubSection.Section.forEach(dataEntry => {
                                if(dataEntry.TOCHeading === "Inhalation Symptoms"){
                                    ExposureEffects.inhalation = dataEntry.Description;
                                } else if (dataEntry.TOCHeading === "Skin Symptoms"){
                                    ExposureEffects.skin = dataEntry.Description;
                                } else if (dataEntry.TOCHeading === "Eye Symptoms"){
                                    ExposureEffects.eye = dataEntry.Description;
                                } else if (dataEntry.TOCHeading === "Ingestion Symptoms"){
                                    ExposureEffects.ingestion = dataEntry.Description;
                                } else if (dataEntry.TOCHeading === "Acute Effects"){
                                    ExposureEffects.acute = dataEntry.Description;
                                } 

                            })
                            if(Object.keys(ExposureEffects) != 0){
                                chemObject.exposure_effects = ExposureEffects
                            }
                        }
                    })
                }

                else if(dataSection.TOCHeading === "Associated Disorders and Diseases"){

                }

            });
            return chemObject;


    }


    



// Get Rest of Data Through https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/7845/JSON/