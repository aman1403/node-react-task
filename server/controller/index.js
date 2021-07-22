import fs from 'fs'
import { v4 } from 'uuid';
import faker from 'faker';
import url from 'url';
const text = require("pdf-stream").text;



import pdfService from '../lib';
import User from '../models/user';
import File from '../models/file';

export const taskController = {

  postHandler: async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      let users = ''
      req.setEncoding('utf8');
      const fileName = v4() + '.pdf';
      let writeStream = fs.createWriteStream(`./pdf/${fileName}`);
      req.on('data', (data) => {
        users += data
      })
      req.on('end', async () => {
        const data = JSON.parse(users)
        const pdf = pdfService.create(data.data);
        pdf.pipe(writeStream);
        pdf.end();
        User.insertMany(data.data)
        let file = new File({'fileName': fileName, 'createdAt': Date.now()});
        file.save();
        res.end(JSON.stringify({ fileName }));
      });
    } catch (err) {
      console.log(err)
      res.end(JSON.stringify({ message: err.message }));
    }
  },

  downloadPdf: (req, res) => {
    const urlData = url.parse(req.url, true)
    res.setHeader('Content-disposition', 'inline; filename="' + urlData.query.fileName + '"');
    res.setHeader('Content-Type', 'application/pdf');
    fs.readFile(`./pdf/${urlData.query.fileName}`, (error,data) => {
      if(error){
        res.end(JSON.stringify({msg:error}));
      } else{
        res.write(data);
        res.end();       
      }
    });
  },

  getFakerData: (req, res) => {
    const data = new Array(10000).fill().map((value, index) => ({
      'S.No.': index,
      'email': faker.internet.email(), 
      'firstName': faker.name.firstName(),
      'lastName': faker.name.lastName(),
      'city': faker.address.city(), 
      'address': faker.address.streetAddress(),
      'phoneNumber': faker.phone.phoneNumber()
    }))
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data }));
  }

};
