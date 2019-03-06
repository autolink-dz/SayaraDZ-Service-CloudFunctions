var request = require("request");



let get_brand = {
    id:'',
    nom:'',
    url:'',
 };

 let post_brand = {
    nom:'test',
    url:'test',
 };

 let update_brand = {
    nom:'testUpdated',
 };

 let toClean = []

 
 let base_url = "https://us-central1-sayaradz-75240.cloudfunctions.net/sayaraDzApi/api/v1/marques"

 
describe("/marques", function() {

    afterEach(function () {
        toClean.forEach((id,index) => {
            request.delete(base_url+"/"+id,function(error, response, body) {

            })

       })
    },2000);


    describe("GET /marques", function() {
        it("returns status code 200", function(done) {
            request.get(base_url+"?next=0", function(error, response, body) {
            let jsonResponse = JSON.parse(body);
            let resBrands = jsonResponse.data;
            let rows = resBrands.map((elm) => {
                expect( JSON.stringify(Object.keys(get_brand).sort()) === JSON.stringify(Object.keys(elm).sort())).toBeTruthy();
            });
            expect(response.statusCode).toBe(200);
            done();
             });
        });
    });

    describe("POST /marques", function() {
        it("returns status code 200", function(done) {
            request.post(base_url, {form: post_brand } ,function(error, response, body) {
            let  resBrand = JSON.parse(body);
            expect( post_brand.nom == resBrand.nom).toBeTruthy();
            expect( post_brand.url == resBrand.url).toBeTruthy();
            expect(response.statusCode).toBe(200);
            toClean.push(resBrand.id)
            done();
             });
        });
    });

    describe("DELETE /marques", function() {
        it("returns status code 200", function(done) {
            request.post(base_url, {form: post_brand } ,function(error, response, body) {
            let postResBrand = JSON.parse(body);
            request.delete(base_url+"/"+postResBrand.id,function(error, response, body) {
                let deleteResBrand = JSON.parse(body);
                expect( deleteResBrand.id == postResBrand.id).toBeTruthy();
                expect(response.statusCode).toBe(200);
                done();
            })
             });
        });
    });
    

    describe("UPDATE /marques", function() {
        it("returns status code 200", function(done) {
            request.post(base_url, {form: post_brand } ,function(error, response, body) {
            let postResBrand = JSON.parse(body);
            request.put(base_url+"/"+postResBrand.id,{form: update_brand},function(error, response, body) {
                let updateResBrand = JSON.parse(body);
                expect( updateResBrand.id == postResBrand.id).toBeTruthy();
                expect( updateResBrand.nom == update_brand.nom).toBeTruthy();
                expect(response.statusCode).toBe(200);
                toClean.push(updateResBrand.id)
                done();
            })
             });
        });
    });
})
