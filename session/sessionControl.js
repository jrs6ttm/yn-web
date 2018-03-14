//console.log('getProject')
var assert=require('assert'); 
var async = require('async');
var EventProxy =   require('eventproxy');
//var mongodb = require('./db.js');
//var ObjectID = require('mongodb').ObjectID;


function sessionControl(resu) {
	    this.userid = resu.userid;
		this.auid = resu.auid;
		this.desid  =  resu.desid  ;
		this.name  =  resu.name  ;
		this.passw  =  resu.passw  ;
		this.cancelstatus  =  resu.cancelstatus  ;
	};	
	
module.exports = sessionControl;

//--function

//callback返回参数： flag:true or false; doc: session值
sessionControl.getSession = function getSession(phpPath,cookies, callback){
  //向php发送get session的请求

  doc = {'uid' : 3};
  callback(true, doc);


}  //getSession end

































/*


//1.FindOne   , 0: _id, 1:userid,  2.name  
User.UserFindOne = function  UserFindOne(x, val  ,  callback) {
	
		//console.log('11');
		//console.log("Val:"+val);
		//console.log("x:"+x);	
		//console.log("projID:"+projID);	
	mongodb.open(function(err,db){
		if(err) {return callback(err);}
		var  cursor= db.collection('users');

			  //--开始数据库操作
		     switch(true)  
		     {
		     case x==0: 
		    		var objID= new ObjectID(val);
		            cursor.findOne({'_id' : objID  } , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1: 
		    	 cursor.findOne({'userid' :  val }   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:  
		    	 cursor.findOne({'name' :  val , 'cancelstatus':1}   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;

		     } //-switch end
		     
   });  //--mongodb.open end!
	
	
}



//--function end



//---users  文档的数据库操作.
		
// 1.FindOne   , 0: _id, 1:userid,  2.name  
	    
User.UserFindOne_X = function UserFindOne_X(x, projID,val , callback){
	mongodb.open(function(err,db){
		
		//console.log('11');
		//console.log("Val:"+val);
		//console.log("x:"+x);	
		//console.log("projID:"+projID);	
		if(err) {mongodb.close(); return callback(err);}
		var tt=0;
	   // var cursor =db.collection('userproject');
	  //  assert.equal(err,null);
		db.collection('users',function(err,collection){
			if(err) {mongodb.close(); return callback(err);}
			var nullerr=null;
			  //--开始数据库操作
		     switch(true)  
		     {
		     case x==0:
		    	      //console.log('11');
		    		var objID= new ObjectID(val);
				     collection.findOne({'_id' : objID  } , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1: 
				
			     collection.findOne({'userid' :  parseInt(val) }   , function(err,doc){
						callback(err,doc);
					 });   
		    	 break;
		    	 
		     case x==2:  
					var cursor_users =db.collection('users').find( {'name':val ,'cancelstatus' : 1} );
				    var cursor_usersproject =db.collection('userproject');	
				    var flg=0, t=0;nulltmp=null;
				    var  nullerr=null, reuu=null;
				  
   		    	 cursor_users.toArray(function(err, doctmp) {
 		    	    if(doctmp.length==0)       {return callback(nulltmp); } 
 		    	    else
 		    	    { 	    	
 		    	       async.eachSeries(doctmp, function(value, callback){
 		    	    	  cursor_usersproject.findOne({'userid':value.userid ,  'projid': projID, 'cancelstatus' : 1  },function(err,result) {
 		    	    	  assert.equal(err,null);
 		    			  if(result !=null)  {reuu=value;flg=1;  return callback(err); }
 		    			  else
 		    				 return callback(); 
                           });		//--cursor_usersproject.findOne	 
 		    	    	
                         }, function(err) {
 		    	    		if(err)  console.log(err);  
 		    	    		return callback(nullerr,reuu);
 		    	        } );   //async.eachSeries  end
 		    	    	
 		    	   }  //--if  end     		       
                });     //--cursor_users.toArray end	    		
              
   		    	 break;
		     
		     case (x!=0 && x!=1 && x!=2):
		    	 mongodb.close();
		    	 callback(nullerr);
		    	 break;	 
		     } //-switch end
		     
		});  //--db.collection end!
   });  //--mongodb.open end!
    
}   //User.UserFindOne  end



//2.insert

User.UserInsert = function   UserInsert (mod,prjID,newUser,callback) {
	//var projosn = 'projosn.' + prjID;
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('users',function(err,collection){
        	if(err) {  return callback(err);}
	        var nulldoc=null, nulltmp=null;
    	    var cursor =db.collection('userproject');
    	    var cursor_mod =db.collection('usermodule');
    	    
    	    assert.equal(err,null);
        	//开始数据库操作
 	    	
    	    var ep = new EventProxy();
 	    	ep.all('userinsert', 'userproject', 'usermodule', function (userinsert, userproject, usermodule) { 
 	    	     switch (true)
 	    	     {
 	    	     case   userinsert  != null:
 	    	    	 return  callback(userinsert);
 	    	        break;
 	    	    
 	    	     case   userproject != null:
 	    	    	 return  callback(userproject);    	     
	    	        break;
	    	        
 	    	     case    usermodule  != null:
 	    	    	 return  callback(usermodule );    	     
	    	        break;
 	    	     
 	    	     case  userinsert  == null  &&  userproject == null  &&  usermodule ==null  :
 	    	    	return  callback(err,nulltmp);
  	    	        break;
 	    	     }
 	    		
 	    	}); //--ep.all


    	    collection.insert({userid:newUser.userid,  auid: newUser.auid  ,  desid: newUser.desid , name : newUser.name , passw : newUser.passw   , cancelstatus : 1 }, function(err,doc){ 
    	    	if(err){  return callback(err);} 
    	    	else {
    	    	   //nulltmp=doc;ep.emit('userinsert', nulldoc);	
    	    	
    	    	   //insert  userproject.
      	         cursor.insert({'userid':newUser.userid  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){ 
    	            if(err){  return callback(err);} 
    	            else {
        	              //insert usermodule
        	              console.log(mod);
           	          async.forEachOf(mod, function (value, key, callback) {
      	    	          if(value=='on') 
      	    	          {  var keytmp = parseInt(key);
      	    	             cursor_mod.insert({'userid':newUser.userid  ,modid: keytmp  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){  
      	    	        	     if(err)  {console.log(err); nulltmp=err;  } 
      	    	        	   callback();
      	    	        	  });  //cursor_mod.insert  end
      	    	         
      	    	          }  else { callback(); }   //if end
      	    	    	   
      	             }, function (err) {
     	    		        if(err!=null || nulltmp !=null) { return callback(err); }
     	    		     else {return callback(err,doc); }  
      	    	    }); //---async.forEachOf
           	          
    	            }  	//if end          
      	          });  //---cursor.insert end 	
    	       }  // if end
            });  //--collection.insert end!  	


      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!





User.UserInsert_V2 = function   UserInsert_V2 (userid,mod,prjID,callback) {
	//var projosn = 'projosn.' + prjID;
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('users',function(err,collection){
        	if(err) {  return callback(err);}
	        var nulldoc=null, nulltmp=null;
    	    var cursor =db.collection('userproject');
    	    var cursor_mod =db.collection('usermodule');
    	   
    	    	   //nulltmp=doc;ep.emit('userinsert', nulldoc);	
    	    	
    	    	   //insert  userproject.
      	         cursor.insert({'userid':userid  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){ 
    	            if(err){  return callback(err);} 
    	            else {
        	              //insert usermodule
        	              //console.log(mod);
           	          async.forEachOf(mod, function (value, key, callback) {
      	    	          if(value=='on') 
      	    	          {  var keytmp = parseInt(key);
      	    	             cursor_mod.insert({'userid':userid  ,modid: keytmp  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){  
      	    	        	     if(err)  {console.log(err); nulltmp=err;  } 
      	    	        	   callback();
      	    	        	  });  //cursor_mod.insert  end
      	    	         
      	    	          }  else { callback(); }   //if end
      	    	    	   
      	             }, function (err) {
     	    		        if(err!=null || nulltmp !=null) { return callback(err); }
     	    		     else {return callback(err,true); }  
      	    	    }); //---async.forEachOf
           	          
    	            }  	//if end          
      	          });  //---cursor.insert end 	



      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!




function IsModuleExist(modid,callback) {
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('module').find({'modid':modid , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}

User.usermodule = function usermodule(projid,userid,callback) {
	mongodb.open(function(err,db) {
		assert.equal(err,null);
		var nulltmp=null , result = '代码:' , resultnull = '代码:Null';
        var cursor = db.collection('usermodule').find({'userid':userid, 'projid':projid, 'cancelstatus':1});
       // assert.equal(err,null);
        cursor.toArray(function(err, doc){
        	if(doc.length == 0) return callback(err,resultnull);
        	else
        		{
        		var i=0;
        		async.eachSeries(doc, function(value, callback){
        			i++;
        			IsModuleExist(parseInt(value.modid), function(flag){
        				//console.log('Flag:' + flag +', ID:' +value.modid );
        				if(flag==0) callback(); 
        				else 
        					{
         			            if(i==doc.length) { result  =result + value.modid ; callback();  }
     			                else
     				            {result  = result + value.modid +"," ;  callback();  }	
        					}
        				
        			});
        			
		
        		}, function(err){ return callback(err,result);});
 		
            }  //if end
        	
        });  //--cursor toArray END

	});   //--mongodb.open end!
		
}



function IsUserInPrj(projid,userid,callback){
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject').find({'userid':userid, 'projid':projid , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}


 function PrjandUser_youxiao(userid, projid ,callback){
	 var flag=1;
	mongodb.open(function(err,db){
		if(err)  return callback(err);
		var cursor_user=db.collection('users').find({'userid':parseInt(userid), 'cancelstatus':0});
		var cursor_prj=db.collection('project').find({'projid':parseInt(projid), 'cancelstatus':0});
		
		cursor_user.toArray(function(err,userdoc){
			if(userdoc.length != 0)  return callback(0);
			else
				cursor_prj.toArray(function(err,prjdoc){
					if(prjdoc.length != 0)  return callback(0);
					else
					 return callback(1);
				});
				 
		});
	
	});
	
}





//cancel   val: 1: _id, 2:userid,  3.name  
User.cancelUser=function cancelUser(x,val,prjid,callback) {
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('users');

		switch (true) 
		{
		case  x==1 :
			var objID= new ObjectID(val);
		     cursor.update({_id: objID}, {$set: { cancelstatus : 0} }, {w:1}, function(err) {
		     return  callback(err,true);
		    });
		   break;
		
		case  x==2 :
			console.log(val);
		     cursor.update({userid: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
		    	 return   callback(err,true);
			    });
			break;
			
		case x==3 :
			cursor.update({projid:prjid,  name:val}, {$set: {cancelstatus:0}}, {w:1}, function(err) {
				return callback(err,true);
			});
			break;

		}

	});	
}





//4. cancel project      cancelstatus: 0:注销， 1：正常

Project.PrjCancel = function PrjCancel(val,callback) {
	mongodb.open(function(err,db){
		if(err) { return callback(err);}
		db.collection('project',function(err,collection){
			if(err) {  mongodb.close(); return callback(err);}
			var nullerr=null;
			var objID= new ObjectID(val);
		
			console.log("ID:"+ val);
		
			collection.update({'_id' : objID }, {$set: {cancelstatus: 0}}, {w:1}, function(err) {
			      if (err) { console.warn(err.message);} 
			      else console.log('successfully updated');
			      callback(err);
			    });
			
			
			
			//console.log("Val:"+val);
			//console.log("x:"+x);		
	
	  });  //--db.collection end!
  });   //--mongodb.open end!
}   //--function end!






function   cancelAdmuserAll(prjID, callback)
{  
	console.log('cancel Admuser All:' + prjID );
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('admuser');
		cursor.update({'projid' : prjID }, {$set: {cancelstatus: 0}}, {multi:true}, function(err) {
         if(err) console.log(err);
         return callback(err);
		});
		
	});
}






//cancel admuser,    module ,   usermodule, userproject;  users: 如果有用户只存在于此project中， 将其注销。
Project.cancelPrjAll = function cancelPrjAll(prjID, callback) {
	var ep =new EventProxy();
	var resul='ok';
	
	ep.all('usermod',function(usermod){
		cancelusersAll(prjID, function(err){
			console.log('5');
			return callback(err,true);
		});
	});

	ep.all('userproject',function(usermod){
		cancelusermoduleAll(prjID, function(err){
			console.log('4');
			ep.emit( 'usermod' , resul);	
		});
	});
	
   ep.all('mod',function(usermod){
	    canceluserprojectAll(prjID, function(err){
	    	console.log('3');
	    	ep.emit( 'userproject' , resul);	
		});
	});
	
	ep.all('adm',function(usermod){
		cancelmoduleAll(prjID, function(err){
			console.log('2');
			ep.emit( 'mod' , resul);	
		});
	});
	
	cancelAdmuserAll(prjID, function(err){
		ep.emit( 'adm' , resul);	
		console.log('1');
	});
	
}



*/





















