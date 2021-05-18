/// <reference types="cypress" />
describe("api request", () => {
  //Задача 1
  it("Проверка есть ли в запросе город Москва", () => {
    //вариант 1
    cy.intercept(
      "GET",
      "https://www.onetwotrip.com/_bus/geo/suggest?query=&limit=10"
    ).as("suggest");
    cy.visit("https://www.onetwotrip.com/ru/bus/");
    cy.wait("@suggest").then((bus) => {
      bus.response.body.data.forEach((city) => {
        if (city.name.includes("Москва")) {
          expect(city.name).to.eq("Москва");
          return;
        }
      });
    });
  });
  //вариант2
  it("Действительно ли в запросе содержится Москва", () => {
    function getCity(cityName) {
      cy.request(
        "GET",
        `https://www.onetwotrip.com/_bus/geo/suggest?query=${cityName}`
      ).then((city) => {
        console.log(city);
        cy.wrap(city.body.data).each(($moscow) => {
          expect($moscow.name).to.includes(cityName);
        });
      });
    }
    getCity("Москва");
  });

  //Задача 2

  //вариант 1
  it("проверка через should", () => {
    cy.visit("https://www.onetwotrip.com");
    cy.url().should("eq", "https://www.onetwotrip.com/ru/");
  });
  //вариант 2
  it("проверка через intercept", () => {
    cy.intercept("GET", "https://www.onetwotrip.com").as("onetwotrip");
    cy.visit("https://www.onetwotrip.com");
    cy.wait("@onetwotrip").then((req) => {
      expect(req.response.statusCode).to.eq(307);
      expect(req.response.headers.location).to.eq(
        "https://www.onetwotrip.com/ru/"
      );
    });
  });
});
