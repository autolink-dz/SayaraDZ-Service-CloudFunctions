var request = require("request");

let get_carProvider = {
    email: "",
    id: "",
    nom: "",
    num_tel: "",
    id_marque: "",
    prenom: "",
 };

 let update_carProvider = {
    nom:'testUpdated',
 };

 

let base_url = "https://us-central1-sayaradz-75240.cloudfunctions.net/sayaraDzApi/api/v1/fabricants"
describe("/fabricants", function() {

    afterEach(function () {
       
    },2000);


    describe("GET /fabricants", function() {
        it("returns status code 200", function(done) {
         
        });
    });


    describe("DELETE /fabricants", function() {
        it("returns status code 200", function(done) {
          
        });
    });
    
    describe("UPDATE /marques", function() {
        it("returns status code 200", function(done) {
     
        });
    });


    describe("POST /marques", function() {
        it("returns status code 200", function(done) {
     
        });
    });
})
