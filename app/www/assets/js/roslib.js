var ROSLIB=ROSLIB||{REVISION:"6"};ROSLIB.URDF_SPHERE=0,ROSLIB.URDF_BOX=1,ROSLIB.URDF_CYLINDER=2,ROSLIB.URDF_MESH=3,ROSLIB.ActionClient=function(t){var e=this;t=t||{},this.ros=t.ros,this.serverName=t.serverName,this.actionName=t.actionName,this.timeout=t.timeout,this.goals={};var i=!1,s=new ROSLIB.Topic({ros:this.ros,name:this.serverName+"/feedback",messageType:this.actionName+"Feedback"}),n=new ROSLIB.Topic({ros:this.ros,name:this.serverName+"/status",messageType:"actionlib_msgs/GoalStatusArray"}),o=new ROSLIB.Topic({ros:this.ros,name:this.serverName+"/result",messageType:this.actionName+"Result"});this.goalTopic=new ROSLIB.Topic({ros:this.ros,name:this.serverName+"/goal",messageType:this.actionName+"Goal"}),this.cancelTopic=new ROSLIB.Topic({ros:this.ros,name:this.serverName+"/cancel",messageType:"actionlib_msgs/GoalID"}),this.goalTopic.advertise(),this.cancelTopic.advertise(),n.subscribe(function(t){i=!0,t.status_list.forEach(function(t){var i=e.goals[t.goal_id.id];i&&i.emit("status",t)})}),s.subscribe(function(t){var i=e.goals[t.status.goal_id.id];i&&(i.emit("status",t.status),i.emit("feedback",t.feedback))}),o.subscribe(function(t){var i=e.goals[t.status.goal_id.id];i&&(i.emit("status",t.status),i.emit("result",t.result))}),this.timeout&&setTimeout(function(){i||e.emit("timeout")},this.timeout)},ROSLIB.ActionClient.prototype.__proto__=EventEmitter2.prototype,ROSLIB.ActionClient.prototype.cancel=function(){var t=new ROSLIB.Message;this.cancelTopic.publish(t)},ROSLIB.Goal=function(t){var e=this;this.actionClient=t.actionClient,this.goalMessage=t.goalMessage,this.isFinished=!1;var i=new Date;this.goalID="goal_"+Math.random()+"_"+i.getTime(),this.goalMessage=new ROSLIB.Message({goal_id:{stamp:{secs:0,nsecs:0},id:this.goalID},goal:this.goalMessage}),this.on("status",function(t){e.status=t}),this.on("result",function(t){e.isFinished=!0,e.result=t}),this.on("feedback",function(t){e.feedback=t}),this.actionClient.goals[this.goalID]=this},ROSLIB.Goal.prototype.__proto__=EventEmitter2.prototype,ROSLIB.Goal.prototype.send=function(t){var e=this;e.actionClient.goalTopic.publish(e.goalMessage),t&&setTimeout(function(){e.isFinished||e.emit("timeout")},t)},ROSLIB.Goal.prototype.cancel=function(){var t=new ROSLIB.Message({id:this.goalID});this.actionClient.cancelTopic.publish(t)},ROSLIB.Message=function(t){var e=this;t=t||{},Object.keys(t).forEach(function(i){e[i]=t[i]})},ROSLIB.Param=function(t){t=t||{},this.ros=t.ros,this.name=t.name},ROSLIB.Param.prototype.get=function(t){var e=new ROSLIB.Service({ros:this.ros,name:"/rosapi/get_param",serviceType:"rosapi/GetParam"}),i=new ROSLIB.ServiceRequest({name:this.name,value:JSON.stringify("")});e.callService(i,function(e){var i=JSON.parse(e.value);t(i)})},ROSLIB.Param.prototype.set=function(t){var e=new ROSLIB.Service({ros:this.ros,name:"/rosapi/set_param",serviceType:"rosapi/SetParam"}),i=new ROSLIB.ServiceRequest({name:this.name,value:JSON.stringify(t)});e.callService(i,function(){})},ROSLIB.Ros=function(t){t=t||{};var e=t.url;this.socket=null,this.idCounter=0,this.setMaxListeners(0),e&&this.connect(e)},ROSLIB.Ros.prototype.__proto__=EventEmitter2.prototype,ROSLIB.Ros.prototype.connect=function(t){function e(t){a.emit("connection",t)}function i(t){a.emit("close",t)}function s(t){a.emit("error",t)}function n(t,e){var i=new Image;i.onload=function(){var t=document.createElement("canvas"),s=t.getContext("2d");t.width=i.width,t.height=i.height,s.drawImage(i,0,0);for(var n=s.getImageData(0,0,i.width,i.height).data,o="",a=0;n.length>a;a+=4)o+=String.fromCharCode(n[a],n[a+1],n[a+2]);var r=JSON.parse(o);e(r)},i.src="data:image/png;base64,"+t.data}function o(t){function e(t){"publish"===t.op?a.emit(t.topic,t.msg):"service_response"===t.op&&a.emit(t.id,t.values)}var i=JSON.parse(t.data);"png"===i.op?n(i,function(t){e(t)}):e(i)}var a=this;this.socket=new WebSocket(t),this.socket.onopen=e,this.socket.onclose=i,this.socket.onerror=s,this.socket.onmessage=o},ROSLIB.Ros.prototype.close=function(){this.socket&&this.socket.close()},ROSLIB.Ros.prototype.authenticate=function(t,e,i,s,n,o,a){var r={op:"auth",mac:t,client:e,dest:i,rand:s,t:n,level:o,end:a};this.callOnConnection(r)},ROSLIB.Ros.prototype.callOnConnection=function(t){var e=this,i=JSON.stringify(t);this.socket&&this.socket.readyState===WebSocket.OPEN?e.socket.send(i):e.once("connection",function(){e.socket.send(i)})},ROSLIB.Ros.prototype.getTopics=function(t){var e=new ROSLIB.Service({ros:this,name:"/rosapi/topics",serviceType:"rosapi/Topics"}),i=new ROSLIB.ServiceRequest;e.callService(i,function(e){t(e.topics)})},ROSLIB.Ros.prototype.getServices=function(t){var e=new ROSLIB.Service({ros:this,name:"/rosapi/services",serviceType:"rosapi/Services"}),i=new ROSLIB.ServiceRequest;e.callService(i,function(e){t(e.services)})},ROSLIB.Ros.prototype.getParams=function(t){var e=new ROSLIB.Service({ros:this,name:"/rosapi/get_param_names",serviceType:"rosapi/GetParamNames"}),i=new ROSLIB.ServiceRequest;e.callService(i,function(e){t(e.names)})},ROSLIB.Service=function(t){t=t||{},this.ros=t.ros,this.name=t.name,this.serviceType=t.serviceType},ROSLIB.Service.prototype.callService=function(t,e){this.ros.idCounter++;var i="call_service:"+this.name+":"+this.ros.idCounter;this.ros.once(i,function(t){var i=new ROSLIB.ServiceResponse(t);e(i)});var s=[];Object.keys(t).forEach(function(e){s.push(t[e])});var n={op:"call_service",id:i,service:this.name,args:s};this.ros.callOnConnection(n)},ROSLIB.ServiceRequest=function(t){var e=this;t=t||{},Object.keys(t).forEach(function(i){e[i]=t[i]})},ROSLIB.ServiceResponse=function(t){var e=this;t=t||{},Object.keys(t).forEach(function(i){e[i]=t[i]})},ROSLIB.Topic=function(t){t=t||{},this.ros=t.ros,this.name=t.name,this.messageType=t.messageType,this.isAdvertised=!1,this.compression=t.compression||"none",this.throttle_rate=t.throttle_rate||0,this.compression&&"png"!==this.compression&&"none"!==this.compression&&this.emit("warning",this.compression+" compression is not supported. No compression will be used."),0>this.throttle_rate&&(this.emit("warning",this.throttle_rate+" is not allowed. Set to 0"),this.throttle_rate=0)},ROSLIB.Topic.prototype.__proto__=EventEmitter2.prototype,ROSLIB.Topic.prototype.subscribe=function(t){var e=this;this.on("message",function(e){t(e)}),this.ros.on(this.name,function(t){var i=new ROSLIB.Message(t);e.emit("message",i)}),this.ros.idCounter++;var i="subscribe:"+this.name+":"+this.ros.idCounter,s={op:"subscribe",id:i,type:this.messageType,topic:this.name,compression:this.compression,throttle_rate:this.throttle_rate};this.ros.callOnConnection(s)},ROSLIB.Topic.prototype.unsubscribe=function(){this.ros.removeAllListeners([this.name]),this.ros.idCounter++;var t="unsubscribe:"+this.name+":"+this.ros.idCounter,e={op:"unsubscribe",id:t,topic:this.name};this.ros.callOnConnection(e)},ROSLIB.Topic.prototype.advertise=function(){this.ros.idCounter++;var t="advertise:"+this.name+":"+this.ros.idCounter,e={op:"advertise",id:t,type:this.messageType,topic:this.name};this.ros.callOnConnection(e),this.isAdvertised=!0},ROSLIB.Topic.prototype.unadvertise=function(){this.ros.idCounter++;var t="unadvertise:"+this.name+":"+this.ros.idCounter,e={op:"unadvertise",id:t,topic:this.name};this.ros.callOnConnection(e),this.isAdvertised=!1},ROSLIB.Topic.prototype.publish=function(t){this.isAdvertised||this.advertise(),this.ros.idCounter++;var e="publish:"+this.name+":"+this.ros.idCounter,i={op:"publish",id:e,topic:this.name,msg:t};this.ros.callOnConnection(i)},ROSLIB.Pose=function(t){t=t||{},this.position=new ROSLIB.Vector3(t.position),this.orientation=new ROSLIB.Quaternion(t.orientation)},ROSLIB.Pose.prototype.applyTransform=function(t){this.position.multiplyQuaternion(t.rotation),this.position.add(t.translation);var e=t.rotation.clone();e.multiply(this.orientation),this.orientation=e},ROSLIB.Pose.prototype.clone=function(){return new ROSLIB.Pose(this)},ROSLIB.Quaternion=function(t){t=t||{},this.x=t.x||0,this.y=t.y||0,this.z=t.z||0,this.w=t.w||1},ROSLIB.Quaternion.prototype.conjugate=function(){this.x*=-1,this.y*=-1,this.z*=-1},ROSLIB.Quaternion.prototype.normalize=function(){var t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(t=1/t,this.x=this.x*t,this.y=this.y*t,this.z=this.z*t,this.w=this.w*t)},ROSLIB.Quaternion.prototype.invert=function(){this.conjugate(),this.normalize()},ROSLIB.Quaternion.prototype.multiply=function(t){var e=this.x*t.w+this.y*t.z-this.z*t.y+this.w*t.x,i=-this.x*t.z+this.y*t.w+this.z*t.x+this.w*t.y,s=this.x*t.y-this.y*t.x+this.z*t.w+this.w*t.z,n=-this.x*t.x-this.y*t.y-this.z*t.z+this.w*t.w;this.x=e,this.y=i,this.z=s,this.w=n},ROSLIB.Quaternion.prototype.clone=function(){return new ROSLIB.Quaternion(this)},ROSLIB.Transform=function(t){t=t||{},this.translation=new ROSLIB.Vector3(t.translation),this.rotation=new ROSLIB.Quaternion(t.rotation)},ROSLIB.Transform.prototype.clone=function(){return new ROSLIB.Transform(this)},ROSLIB.Vector3=function(t){t=t||{},this.x=t.x||0,this.y=t.y||0,this.z=t.z||0},ROSLIB.Vector3.prototype.add=function(t){this.x+=t.x,this.y+=t.y,this.z+=t.z},ROSLIB.Vector3.prototype.subtract=function(t){this.x-=t.x,this.y-=t.y,this.z-=t.z},ROSLIB.Vector3.prototype.multiplyQuaternion=function(t){var e=t.w*this.x+t.y*this.z-t.z*this.y,i=t.w*this.y+t.z*this.x-t.x*this.z,s=t.w*this.z+t.x*this.y-t.y*this.x,n=-t.x*this.x-t.y*this.y-t.z*this.z;this.x=e*t.w+n*-t.x+i*-t.z-s*-t.y,this.y=i*t.w+n*-t.y+s*-t.x-e*-t.z,this.z=s*t.w+n*-t.z+e*-t.y-i*-t.x},ROSLIB.Vector3.prototype.clone=function(){return new ROSLIB.Vector3(this)},ROSLIB.TFClient=function(t){t=t||{},this.ros=t.ros,this.fixedFrame=t.fixedFrame||"/base_link",this.angularThres=t.angularThres||2,this.transThres=t.transThres||.01,this.rate=t.rate||10,this.goalUpdateDelay=t.goalUpdateDelay||50,this.currentGoal=!1,this.frameInfos={},this.goalUpdateRequested=!1,this.actionClient=new ROSLIB.ActionClient({ros:this.ros,serverName:"/tf2_web_republisher",actionName:"tf2_web_republisher/TFSubscriptionAction"})},ROSLIB.TFClient.prototype.processFeedback=function(t){var e=this;t.transforms.forEach(function(t){var i=t.child_frame_id,s=e.frameInfos[i];void 0!==s&&(s.transform=new ROSLIB.Transform({translation:t.transform.translation,rotation:t.transform.rotation}),s.cbs.forEach(function(t){t(s.transform)}))})},ROSLIB.TFClient.prototype.updateGoal=function(){this.currentGoal&&this.currentGoal.cancel();var t={source_frames:[],target_frame:this.fixedFrame,angular_thres:this.angularThres,trans_thres:this.transThres,rate:this.rate};for(var e in this.frameInfos)t.source_frames.push(e);this.currentGoal=new ROSLIB.Goal({actionClient:this.actionClient,goalMessage:t}),this.currentGoal.on("feedback",this.processFeedback.bind(this)),this.currentGoal.send(),this.goalUpdateRequested=!1},ROSLIB.TFClient.prototype.subscribe=function(t,e){"/"===t[0]&&(t=t.substring(1)),void 0===this.frameInfos[t]?(this.frameInfos[t]={cbs:[]},this.goalUpdateRequested||(setTimeout(this.updateGoal.bind(this),this.goalUpdateDelay),this.goalUpdateRequested=!0)):void 0!==this.frameInfos[t].transform&&e(this.frameInfos[t].transform),this.frameInfos[t].cbs.push(e)},ROSLIB.TFClient.prototype.unsubscribe=function(t,e){var i=this.frameInfos[t];if(void 0!==i){var s=i.cbs.indexOf(e);s>=0&&(i.cbs.splice(s,1),0===i.cbs.length&&delete this.frameInfos[t],this.needUpdate=!0)}},ROSLIB.UrdfBox=function(t){t=t||{};var e=this,i=t.xml;this.dimension=null,this.type=null;var s=function(t){this.type=ROSLIB.URDF_BOX;var i=t.getAttribute("size").split(" ");e.dimension=new ROSLIB.Vector3({x:parseFloat(i[0]),y:parseFloat(i[1]),z:parseFloat(i[2])})};s(i)},ROSLIB.UrdfColor=function(t){t=t||{};var e=this,i=t.xml;this.r=null,this.g=null,this.b=null,this.a=null;var s=function(t){var i=t.getAttribute("rgba").split(" ");return e.r=parseFloat(i[0]),e.g=parseFloat(i[1]),e.b=parseFloat(i[2]),e.a=parseFloat(i[3]),!0};s(i)},ROSLIB.UrdfCylinder=function(t){t=t||{};var e=this,i=t.xml;this.type=null,this.length=null,this.radius=null;var s=function(t){e.type=ROSLIB.URDF_CYLINDER,e.length=parseFloat(t.getAttribute("length")),e.radius=parseFloat(t.getAttribute("radius"))};s(i)},ROSLIB.UrdfLink=function(t){t=t||{};var e=this,i=t.xml;this.name=null,this.visual=null;var s=function(t){e.name=t.getAttribute("name");var i=t.getElementsByTagName("visual");i.length>0&&(e.visual=new ROSLIB.UrdfVisual({xml:i[0]}))};s(i)},ROSLIB.UrdfMaterial=function(t){t=t||{};var e=this,i=t.xml;this.name=null,this.textureFilename=null,this.color=null;var s=function(t){e.name=t.getAttribute("name");var i=t.getElementsByTagName("texture");i.length>0&&(e.textureFilename=i[0].getAttribute("filename"));var s=t.getElementsByTagName("color");s.length>0&&(e.color=new ROSLIB.UrdfColor({xml:s[0]}))};s(i)},ROSLIB.UrdfMesh=function(t){t=t||{};var e=this,i=t.xml;this.filename=null,this.scale=null,this.type=null;var s=function(t){e.type=ROSLIB.URDF_MESH,e.filename=t.getAttribute("filename");var i=t.getAttribute("scale");if(i){var s=i.split(" ");e.scale=new ROSLIB.Vector3({x:parseFloat(s[0]),y:parseFloat(s[1]),z:parseFloat(s[2])})}};s(i)},ROSLIB.UrdfModel=function(t){t=t||{};var e=this,i=t.xml,s=t.string;this.materials=[],this.links=[];var n=function(t){var i=t.evaluate("//robot",t,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;e.name=i.getAttribute("name");for(var s in i.childNodes){var n=i.childNodes[s];if("material"===n.tagName){var o=new ROSLIB.UrdfMaterial({xml:n});e.materials[o.name]?console.warn("Material "+o.name+"is not unique."):e.materials[o.name]=o}else if("link"===n.tagName){var a=new ROSLIB.UrdfLink({xml:n});e.links[a.name]?console.warn("Link "+a.name+" is not unique."):(a.visual&&a.visual.material&&(e.materials[a.visual.material.name]?a.visual.material=e.materials[a.visual.material.name]:a.visual.material&&(e.materials[a.visual.material.name]=a.visual.material)),e.links[a.name]=a)}}};if(s){var o=new DOMParser;i=o.parseFromString(s,"text/xml")}n(i)},ROSLIB.UrdfSphere=function(t){t=t||{};var e=this,i=t.xml;this.radius=null,this.type=null;var s=function(t){e.type=ROSLIB.URDF_SPHERE,e.radius=parseFloat(t.getAttribute("radius"))};s(i)},ROSLIB.UrdfVisual=function(t){t=t||{};var e=this,i=t.xml;this.origin=null,this.geometry=null,this.material=null;var s=function(t){var i=t.getElementsByTagName("origin");if(0===i.length)e.origin=new ROSLIB.Pose;else{var s=i[0].getAttribute("xyz"),n=new ROSLIB.Vector3;s&&(s=s.split(" "),n=new ROSLIB.Vector3({x:parseFloat(s[0]),y:parseFloat(s[1]),z:parseFloat(s[2])}));var o=i[0].getAttribute("rpy"),a=new ROSLIB.Quaternion;if(o){o=o.split(" ");var r=parseFloat(o[0]),h=parseFloat(o[1]),c=parseFloat(o[2]),l=r/2,u=h/2,p=c/2,m=Math.sin(l)*Math.cos(u)*Math.cos(p)-Math.cos(l)*Math.sin(u)*Math.sin(p),f=Math.cos(l)*Math.sin(u)*Math.cos(p)+Math.sin(l)*Math.cos(u)*Math.sin(p),v=Math.cos(l)*Math.cos(u)*Math.sin(p)-Math.sin(l)*Math.sin(u)*Math.cos(p),S=Math.cos(l)*Math.cos(u)*Math.cos(p)+Math.sin(l)*Math.sin(u)*Math.sin(p);a=new ROSLIB.Quaternion({x:m,y:f,z:v,w:S}),a.normalize()}e.origin=new ROSLIB.Pose({position:n,orientation:a})}var R=t.getElementsByTagName("geometry");if(R.length>0){var d=null;for(var g in R[0].childNodes){var O=R[0].childNodes[g];if(1===O.nodeType){d=O;break}}var y=d.nodeName;"sphere"===y?e.geometry=new ROSLIB.UrdfSphere({xml:d}):"box"===y?e.geometry=new ROSLIB.UrdfBox({xml:d}):"cylinder"===y?e.geometry=new ROSLIB.UrdfCylinder({xml:d}):"mesh"===y?e.geometry=new ROSLIB.UrdfMesh({xml:d}):console.warn("Unknown geometry type "+y)}var I=t.getElementsByTagName("material");I.length>0&&(e.material=new ROSLIB.UrdfMaterial({xml:I[0]}))};s(i)};