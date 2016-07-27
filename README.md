# 英語 (Eigo)
Simple extension that yells at you for writing good.

[![Available on the Chrome Webstore](https://developer.chrome.com/static/images/platform-pillar/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/eigo-proofread-anything-i/kpaagcfdibdfeopdcigoeemhblkfcdkc)

Send it a publicly available Google Doc and an email, get a custom generated report giving you suggestions on how to improve your writing.

![Screenshot of the Chrome extension](http://puu.sh/jgwjb/afaa2f23fe.png)


### Up and Running
Install dependencies.
```
$ [sudo] npm install
```
Create a ```.env``` file in the project root populated with the following information:
```
SENDGRID_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx
```
Then you can start the webserver.
```
$ node app.js
```
