const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const url = "https://news.ycombinator.com/newest ";

async function scrapeData() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsList = $("tbody");
    const newsArray = [];
    newsList.each(function (index, el) {
      const itemList = {
        title: "",
        author: "",
        date_uploaded: "",
        comments: "",
        no_of_points: "",
      };
      itemList.title = $(el).find(".title").children("span").text();
      itemList.author = $(el).find(".subline").children("span a").text();
      itemList.date_uploaded = $(el).find(".age").children("a").text();
      itemList.comments = $(el).find(".subline").children("a").last().text();
      itemList.no_of_points = $(el)
        .find(".subline")
        .children("span")
        .first()
        .text();
      newsArray.push(itemList);
    });
    // console.log(newsArray);

    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    newdate = day + "-" + month + "-" + year;

    fs.writeFile(`${newdate}.json`, JSON.stringify(newsArray), (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        const parser = new json2csv();
        const csv = parser.parse(newsArray);
        fs.writeFileSync("./news.csv", csv);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
scrapeData();
