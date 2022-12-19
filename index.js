const PORT = 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const {response} = require("express");

const app = express()

const articles = []

const newspaper =[
    {
    name:'thetimes',
    address:'https://www.thetimes.co.uk/environment/climate-change',
        base:'https://www.thetimes.co.uk'
    },
    {
        name:'guardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:'https://www.theguardian.com'
    },
    {
    name:'telegraph',
    address:'https://www.telegraph.co.uk/climate-change',
        base:'https://www.telegraph.co.uk'
    }
]


newspaper.forEach(newspaper=>{

    axios.get(newspaper.address)
        .then(response=>{
            const html = response.data
            const $ =cheerio.load(html)
            $('a:contains("climate")',html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url:newspaper.base+url,
                    source : newspaper.name
                })

            })


        })
})

app.get("/",(reg,res)=>{
    res.json("hi")
})

app.get("/news",(reg,res)=>{
  res.json(articles)
})

app.get("/news/:newspaperId",async(reg,res)=>{
    const newspaperId = reg.params.newspaperId
    const newspaperAddress = newspaper.filter(newspaper=> newspaper.name == newspaperId)[0].address
    const newspaperBase = newspaper.filter(newspaper=>newspaper.name==newspaperId)[0].base
    axios.get(newspaperAddress)
        .then(response=>{
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("climate")',html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url:newspaperBase+url,
                    source:newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(error => console.log(error))
})
app.listen(PORT,() => console.log("server runnig PORT" ))