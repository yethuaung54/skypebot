// api.slack.com/custom-integrations/legacy-tokens.
require('dotenv').config();

var sprintf = require("sprintf-js").sprintf;
var botBuilder = require('claudia-bot-builder');
var requestify = require('requestify');
var moment = require('moment');
var yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');

var today = moment().format('DD'); // GET today date
var yesterdayUnix = moment(yesterday).unix();
var oldest = "&oldest=" + yesterdayUnix;
var slackUrl = "https://slack.com/api/channels.history?token="+ process.env.SLACK_TOKEN +"&channel=C3ABHKCKY&pretty=1";

var iosUsers = [{ _id: "U0BDB8DMM" , name:"winmonswe" },{ _id: "U6SDRKQ57", name: "Naing Htoo" }];
const skypeTemplate = require('claudia-bot-builder').skypeTemplate;

module.exports = botBuilder(message => skypeHandler(message), { platforms: ['skype'] });

function filterByDay(days = 0){
		yesterday = moment().add(days-1, 'days').format('YYYY-MM-DD');
		today = moment().add(days, 'days').format('DD'); // GET today date
		yesterdayUnix = moment(yesterday).unix();
		oldest = "&oldest=" + yesterdayUnix;
		slackUrl+=oldest;
}

function skypeHandler (message) {
	if (message.text.toLowerCase().contains('leave')) {
		if (message.text.toLowerCase().contains('yesterday')) {
			filterByDay(-1);
		} else {
			filterByDay();

		}
		console.log('Slack :', slackUrl);
	  	return requestify.get(slackUrl).then(response => replyMessages(response));

	} else if(message.text.toLowerCase().contains('hello') || message.text.toLowerCase().contains('hey')){
        return `Shin ! :$  `;
    }else if(message.text.toLowerCase().contains('ha ha')){
        return `Don't kid me , I'm so serious! (emo) `;
  	}else if(message.text.toLowerCase().contains('meet')){
    	return `Nice to meet you , too! (inlove) `;
  	}else if(message.text.toLowerCase().contains('help')){
    	return `How can I help you?`;
  	}else if(message.text.toLowerCase().contains('love')){
	  	return `me too ! (inlove) `;
	}else if(message.text.toLowerCase().contains('h1n1')){
	  	return `flu flu ... Go away !!! (ill) `;
	}else if(message.text.toLowerCase().contains('mwah')){
	  	return `:-*`;
	}else if(message.text.toLowerCase().contains('queen') && message.text.toLowerCase().contains('who')){
	  	return `Win Mon would someday become the Queen of HiveloCity (makeup)`;
	}else{
  		return `Bar tway lar pyaw nay tr lal shint ! nar ma lal buuu (donttalk) ...`;
  	}

}

function replyMessages(response) {
	          // Get the response body
		var body = response.getBody();
		var messages = body.messages;
		var leaveUsers = [];
		var leaveDescr = "";
		
	try {
		console.log("Messagesss:", messages);
		for (var i = 0; i <messages.length; i++) {
		  
		    if(!messages[i].attachments){ 
					var userId = messages[i].user;
					var text = messages[i].text;
					console.log('Current USER_ID:', userId);

					var author  = iosUsers.find(function(element){
					  return element._id === userId;
					});
					console.log('Author ID:', author);
					
					if(!author) continue;
					author = author.name.toUpperCase();
					if(text.toLowerCase().contains('half') || text.toLowerCase().contains('am leave')){
						type = "~ Half Day Leave";
					}
					else{
						type = "~ Full Day Leave";
					}
					if (text.toLowerCase().contains(today)){
					  	leaveUsers.push("-"+author+" "+ type); 
					  	leaveDescr += sprintf("\'%s\' said %s. <br/>", text , author);
					}

		    } else {
		          	messages[i].attachments.forEach(function(attachment){
		              var leaveCase = attachment.fields[0].value;
		              var author = attachment.author_name.toUpperCase();
		              var text = attachment.text;
		              console.log(author+":::"+text+"::: Case :::: "+leaveCase);
		              if(text.toLowerCase().contains('half')){
		                type = "~ Half Day Leave";
		              }
		              else{
		                type = "~ Full Day Leave";
		              }
		              if (text.toLowerCase().contains(today)){
		              	leaveUsers.push("-"+author+" "+ type); 
		              	leaveDescr += sprintf("\'%s\' said %s<br/> because of that %s. <br/>", text , author , leaveCase.replace(/because of |because |coz of |coz /gi, ""));
		              }
		          	});
		    }
		  
		}
		if (messages.length > 1) {   
		  		if (leaveUsers.length>1) {
		  			header = 'There\'re ' + leaveUsers.length + ' members who take leave in the HiveloCity. (bandit)<br/>';
		  		} else {
		  			header = 'There\'s ' + leaveUsers.length + ' member who takes leave in the HiveloCity. (bandit)<br/>';
		  		}
			  return header +' ================================ <br/>'+ leaveUsers.join('<br/>') + '<br/>================================<br/>'+ leaveDescr + "<br/>Have a Good Day , Despacito! (idea)";

		} else {
		  return 'No one takes leave ! HiveloCity members are very active today ... (rock)  ';
		}

	} catch(err) {
	   console.error("ERRORsssss:", err);
	   return "Sorry , service is not available right now !  Please contact to your developer ... (brokenheart) ";
	}
}
// Make new string function contains
String.prototype.contains = function(content){
  return this.indexOf(content) !== -1;
}	
