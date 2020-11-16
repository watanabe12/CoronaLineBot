var TOKEN = "JjnBO2h/+fNxfQUPJkxoNOXvZ6hrqzVnt1jWEFsSZiiV0mdqHbxKHU7+8UWscPjm2AeWAqVtSnxmhd4gOZhN7OzV2eAPSYa14VzeQjjptxWyzwmTfq8rVSPD23JQzdSbOKgzOrBCO3gt8AwXFN23BQdB04t89/1O/w1cDnyilFU=";
var URL = "https://api.line.me/v2/bot/message/reply";

function doPost(event) {
  var request = JSON.parse(event.postData.contents);
  var replyToken = request.events[0].replyToken;
  var userMessage = request.events[0].message.text;
  var texts = userMessage.split("の");
  if (texts[1] == "コロナ") {
    // 東洋経済オンラインのcsvデータを引用
    var url = "https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/prefectures.csv"
    var prefecturesCsv = UrlFetchApp.fetch(url).getContentText("UTF-8");
    var prefectures = Utilities.parseCsv(prefecturesCsv);
    var target = texts[0];
    var targetData = prefectures.filter(function(p){
      return p[3] == target
    });
    var latest = targetData.pop(); //最新の陽性データ
    var pre = targetData.pop(); //前日の陽性データ
    var date = latest[0] + '/' + latest[1] + '/' + latest[2];
    var testedPositive = latest[5] - pre[5]; // 差分を抽出
    var message = `【${target} の${date}コロナ感染状況】\n１日の陽性者: ${testedPositive}人, 累計人数: ${latest[5]}人`;
  }else{
    var message = "【都道府県 ＋ のコロナ】と入力をすると各都道府県の陽性者情報が表示されます！";
  }

  var payload = JSON.stringify({
    "replyToken": replyToken,
    "messages": [{
      "type": "text",
      "text": message
    }]
  });
  UrlFetchApp.fetch(URL, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + TOKEN
    },
    "method": "post",
    "payload": payload
  });
  return;
}