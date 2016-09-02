//画像の幅
var w=60;

//現所持金
var money=50;
var use=3;

var started=false;
//止めるか判定
var flag_left=false;
var flag_center=false;
var flag_right=false;

//既に止まっているか判定
var stop_left=false;
var stop_center=false;
var stop_right=false;

//止める位置
var end_left=0;
var end_center=0;
var end_right=0;

var left=document.getElementById("left");
var center=document.getElementById("center");
var right=document.getElementById("right");

//現在位置
var cur_left=0;
var cur_center=0;
var cur_right=0;

//速度指定
var verocity_left=w*10/1000.0;
var verocity_center=-w*10/1000.0;
var verocity_right=w*10/1000.0;

//境界判定に使用
var bottom=w*21;

//残額0でリプレイを引くとGAMEOVER扱いになる対策
var repFlag=false;

//残り時間
var time_left=60;
var gaming=false;

//GAMEOVER時に時間の減少を止める用
var gameover_flag=false;

//ボーナスゲーム中かどうか
var bonus=false;

//ボーナスゲームの残りゲーム数、チェリー数、スイカ数、大当たりのカウント数
var bonus_left=0;
var chry_cnt=0;
var wame_cnt=0;
var big_cnt=0;

//ボーナスゲーム中に何を揃えるか、今どれを押すと揃えるか
var trg=0;
var curflame=0;

//各リールの出目
var array_left=[1,0,8,7,7,1,0,3,1,4,0,4,1,5,2,0,1,6,0,2,5];
var array_center=[1,8,0,8,6,1,7,0,2,2,1,4,0,5,3,1,7,0,1,5,0];	
var array_right=[1,2,8,0,1,0,7,2,1,0,3,4,1,0,5,7,1,0,6,5,0];

//ボーナス時のアシスト用
var firststop=true;
var left_assist=document.getElementById("left_assist");
var center_assist=document.getElementById("center_assist");
var right_assist=document.getElementById("right_assist");
var assist=[1,2,3];
var curassist=0;

onload=init();

function init(){
	document.getElementById("time").style.textAlign="center";
	document.getElementById("money").style.textAlign="right";
	money=input_money();
	money_update();
	time_left=60;
	use=3;
	bonus=false;
	bonus_left=0;
	gameover_flag=false;
	var a=setInterval(function(){
		if(gameover_flag){
			clearInterval(a);
		}
		if(!bonus){
			time_left-=1;
		}
		document.getElementById("time").innerHTML=time_left;
		if(time_left==0){
			finish_flag=true;
			if(!gaming)	finish();
			clearInterval(a);
		}
	},1000);
	return;
}

function input_money(){
	var ret=prompt("所持コインを入力してください。");
	if(ret==null)	return 20;
	if(ret=="")	return 20;
	return ret;
}

function money_update(){
	if(money>=9999){
		document.getElementById("money").innerHTML="9999";
	}
	else{
		document.getElementById("money").innerHTML=("0000"+money).substr(-4);
	}
	return;
}

function start(){	
	document.getElementById("btn_start").src="pushed_btn.png";
	if(started){
		return;
	}
	
	//ボーナス時ならアシストする順番を指定
	if(bonus){
		var n=3,t,i;
		trg=-1;
		firststop=true;
		while(n){
			i=Math.floor(Math.random()*n--);
			t=assist[n];
			assist[n]=assist[i];
			assist[i]=t;
		}
		curassist=1;
		trg=0;
		left_assist.src="figure00"+assist[0]+".png";
		left_assist.style.width="26px";
		center_assist.src="figure00"+assist[1]+".png";
		center_assist.style.width="34px";
		right_assist.src="figure00"+assist[2]+".png";
		right_assist.style.width="34px";
		document.getElementById("BIGStart").play();
	}
	else{
		document.getElementById("ReelStart").play();
	}
	money-=use;
	if(money<0){
		use+=money;
		money=0;
	}
	money_update();
	
	document.getElementById("light1").src="blue_btn.png";
	document.getElementById("light2").src="green_btn.png";
	document.getElementById("light3").src="yellow_btn.png";
	document.getElementById("light4").src="green_btn.png";
	document.getElementById("light5").src="blue_btn.png";
	
	//変数の初期化
	started=true;
	gaming=true;
	repFlag=false;
	flag_left=flag_center=flag_right=false;
	stop_left=stop_center=stop_right=false;
	end_left=end_center=end_right=0;
	
	var left=document.getElementById("left");
	var center=document.getElementById("center");
	var right=document.getElementById("right");
	
	var stime=new Date();
	
	var func=setInterval(function(){
		var etime=new Date();
		var dif=etime-stime;
		stime=etime;
		//現在位置の移動
		if(!stop_left){
			cur_left+=verocity_left*dif;
		}
		if(!stop_center){
			cur_center+=verocity_center*dif;
		}
		if(!stop_right){
			cur_right+=verocity_right*dif;
		}
	
		//終了フラグが立っていて超えたなら止める
		if(flag_left&&cur_left+1e-6>=end_left&&end_left<0){
			if(!stop_left)	document.getElementById("ReelStop").play();			
			stop_left=true;
			cur_left=end_left;
		}
		if(flag_center&&cur_center<=end_center+1e-6&&end_center>-bottom){
			if(!stop_center)	document.getElementById("ReelStop").play();			
			stop_center=true;
			cur_center=end_center;
		}
		if(flag_right&&cur_right+1e-6>=end_right&&end_right<0){
			if(!stop_right)	document.getElementById("ReelStop").play();			
			stop_right=true;
			cur_right=end_right;
		}
		
		//境界を超えていたら元に戻す
		if(cur_left>=0){
			cur_left-=bottom;
			if(end_left>=0){
				end_left-=bottom;
			}
		}
		if(cur_center<=-bottom){
			cur_center+=bottom;
			if(end_center<=-bottom){
				end_center+=bottom;
			}
		}
		if(cur_right>=0){
			cur_right-=bottom;
			if(end_right>=0){
				end_right-=bottom;
			}
		}
		
		//移動の適用
		left.style.top=cur_left+45+"px";
		left.style.clip="rect("+(-cur_left)+","+w+","+(-cur_left+3*w)+",0)";
		center.style.top=cur_center+45+"px";
		center.style.clip="rect("+(-cur_center)+","+w+","+(-cur_center+3*w)+",0)";
		right.style.top=cur_right+45+"px";
		right.style.clip="rect("+(-cur_right)+","+w+","+(-cur_right+3*w)+",0)";
		
		if(stop_left&&stop_center&&stop_right){
			//終了処理
			//end();
			chery_system();
			started=false;
			gaming=false;
			clearInterval(func);
			return;
		}
	},10);
}

function finish(){
	window.alert("ゲーム終了。残りコイン数は"+money+"枚です。");
	init();
}

function stop(num){
	if(num==1){
		//leftを止める
		if(flag_left)	return;
		flag_left=true;
		document.getElementById("btn_left").src="black_btn.png";
		if(bonus&&curassist==assist[0]){
			if(firststop){
				firststop=false;
				var move=bottom-cur_left
				while(move>w)	move-=w;
				var index=Math.floor(-end_left/w+1e-6);
				trg=array_left[(index+1)%21];
			}
			else{
				var dif=bottom;
				for(var i=0;i<21;i+=1){
					if(trg==array_left[i]){
						var point=-w*((i+20)%21);
						if(point<cur_left)	point+=bottom;
						var tmp=point-cur_left;
						if(dif>tmp){
							dif=tmp;
							end_left=point;
						}
					}
				}
				if(dif==-bottom){
					window.alert("error");
				}
			}
			curassist+=1;
		}
		else{
			var move=bottom-cur_left;
			while(move>w)	move-=w;
			end_left=Math.min(cur_left+move,0);
		}
	}
	else if(num==2){
		//centerを止める
		if(flag_center)	return;
		flag_center=true;
		document.getElementById("btn_center").src="black_btn.png";
		if(bonus&&curassist==assist[1]){
			if(firststop){
				firststop=false;
				var move=bottom+cur_center;
				while(move>w)	move-=w;
				end_center=Math.max(cur_center-move,-bottom);
				var index=Math.floor(-end_center/w+1e-6);
				trg=array_center[(index+1)%21];
			}
			else{
				var dif=bottom;
				for(var i=0;i<21;i+=1){
					if(trg==array_center[i]){
						var point=-w*((i+20)%21);
						if(cur_center<point)	point-=bottom;
						var tmp=cur_center-point;
						if(tmp<dif){
							dif=tmp;
							end_center=point;
						}
					}
				}
			}
			curassist+=1;
		}
		else{
			var move=bottom+cur_center;
			while(move>w)	move-=w;
			end_center=Math.max(cur_center-move,-bottom);
		}
	}
	else if(num==3){
		//rightを止める
		if(flag_right)	return;
		flag_right=true;
		document.getElementById("btn_right").src="black_btn.png";
		if(bonus&&curassist==assist[2]){
			if(firststop){
				firststop=false;
				var move=bottom-cur_right;
				while(move>w)	move-=w;
				end_right=Math.min(cur_right+move,0);
				var index=Math.floor(-end_right/w+1e-6);
				trg=array_right[(index+1)%21];
			}
			else{
				var dif=bottom;
				for(var i=0;i<21;i+=1){
					if(trg==array_right[i]){
						var point=-w*((i+20)%21);
						if(point<cur_right)	point+=bottom;
						var tmp=point-cur_right;
						if(dif>tmp){
							dif=tmp;
							end_right=point;
						}
					}
				}
			}
			curassist+=1;
		}
		else{
			var move=bottom-cur_right;
			while (move>w)	move-=w;
			end_right=Math.min(cur_right+move,0);
		}
	}
	return;
}

function btn_release(num){
	if(num==1){
		//leftの画像を戻す
		document.getElementById("btn_left").src="red_btn.png";
	}
	else if(num==2){
		//centerの画像を戻す
		document.getElementById("btn_center").src="red_btn.png";
	}
	else if(num==3){
		//rightの画像を戻す
		document.getElementById("btn_right").src="red_btn.png";
	}
	else if(num==4){
		//startの画像を戻す
		document.getElementById("btn_start").src="start_btn.png";
	}
	return;
}

function wait(){
	var f=setInterval(function(){
		system();
		clearInterval(f);
	},500);
}

function chery_system(){
	/*チェリーの出た回数が
	0:大当たり時に２マスずらす
	1:大当たり時に１マスずらす
	2:何もしない
	3:大当たりになるよう1マスずらす
	4:大当たりになるよう2マスずらす
	5:大当たり確定(7を強制的に揃える)
	*/
	if(chry_cnt<2){//取り敢えず大当たりを検出、あればランダムに動かす
		if(BigHit(cur_left,cur_center,cur_right)){
			chery_move(2,(2-chry_cnt)*w);
			return;
		}
	}
	else if(chry_cnt==5){
		//確定(ここだけここに組む）
		var left_pos=-2*w;
		var center_pos=-w;
		var right_pos=-2*w;
		if(left_pos<cur_left)	left_pos+=bottom;
		if(center_pos>cur_center)	center_pos-=bottom;
		if(right_pos<cur_right)	right_pos+=bottom;
		var left_dif=left_pos-cur_left;
		var center_dif=cur_center-center_pos;
		var right_dif=right_pos-cur_right;
		var timecnt=0;
		left_dif/=20.0;
		center_dif/=20.0;
		right_dif/=20.0;
		var func=setInterval(function(){
			cur_left+=left_dif;
			cur_center-=center_dif;
			cur_right+=right_dif;
			if(cur_left>=0)	cur_left-=bottom;
			if(cur_center<=-bottom)	cur_center+=bottom;
			if(cur_right>=0)	cur_right-=bottom;
			left.style.top=cur_left+45+"px";
			left.style.clip="rect("+(-cur_left)+","+w+","+(-cur_left+3*w)+",0)";
			center.style.top=cur_center+45+"px";
			center.style.clip="rect("+(-cur_center)+","+w+","+(-cur_center+3*w)+",0)";
			right.style.top=cur_right+45+"px";
			right.style.clip="rect("+(-cur_right)+","+w+","+(-cur_right+3*w)+",0)";
			timecnt+=1;
			if(timecnt==20){
				end();
				clearInterval(func);
			}
		},10);
	}
	else if(chry_cnt>2){
		//リールをchry_cnt-2個どこかで動かした時に正しい
		if(BigHit(cur_left,cur_center,cur_right)){
			return;
		}
		if(chry_cnt==4){
			//先にリールを２マス動かした時の処理をする
			if(BigHit(cur_left+2*w,cur_center,cur_right)){
				chery_move(0,2*w);
				return;
			}
			else if(BigHit(cur_left,cur_center-2*w,cur_right)){
				chery_move(1,-2*w);
				return;
			}
			else if(BigHit(cur_left,cur_center,cur_right+2*w)){
				chery_move(2,2*w);
				return;
			}
		}
		if(BigHit(cur_left+w,cur_center,cur_right)){
			chery_move(0,w);
			return;
		}
		else if(BigHit(cur_left,cur_center-w,cur_right)){
			chery_move(1,-w);
			return;
		}
		else if(BigHit(cur_left,cur_center,cur_right+w)){
			chery_move(2,w);
			return;
		}
	}
	end();
}

function BigHit(a,b,c){
	//大当たりかどうか返す（その前にオーバー分の処理をする）
	if(a>=0)	a-=bottom;
	if(b<=-bottom)	b+=bottom;
	if(c>0)	c-=bottom;
	
	var index_left=Math.floor(-a/w+1e-6);
	var up_left=array_left[index_left];
	var mid_left=array_left[(index_left+1)%21];
	var low_left=array_left[(index_left+2)%21];
	
	var index_center=Math.floor(-b/w+1e-6);
	var up_center=array_center[index_center];
	var mid_center=array_center[(index_center+1)%21];
	var low_center=array_center[(index_center+2)%21];
	
	var index_right=Math.floor(-c/w+1e-6);
	var up_right=array_right[index_right];
	var mid_right=array_right[(index_right+1)%21];
	var low_right=array_right[(index_right+2)%21];
	
	if(equals(up_left,mid_center,low_right)&&up_left>=7)	return true;
	if(equals(up_left,up_center,up_right)&&up_left>=7)	return true;
	if(equals(mid_left,mid_center,mid_right)&&mid_left>=7)	return true;
	if(equals(low_left,low_center,low_right)&&low_left>=7)	return true;
	if(equals(low_left,mid_center,up_right)&&low_left>=7)	return true;
	return false;
}

function chery_move(moved,to){
	//movedのリールをtoの距離動かす
	//0.5秒間で移動
	var timecnt=0;
	if(moved==0){
		var v=to/50.0;
		var func=setInterval(function(){
			cur_left+=v;
			if(cur_left>=0)	cur_left-=bottom;
			left.style.top=cur_left+45+"px";
			left.style.clip="rect("+(-cur_left)+","+w+","+(-cur_left+3*w)+",0)";
			timecnt+=1;
			if(timecnt==50){
				end();
				clearInterval(func);
			}
		},10);
	}
	else if(moved==1){
		var v=to/50.0;
		var func=setInterval(function(){
			cur_center+=v;
			if(cur_center<=-bottom)	cur_center+=bottom;
			left.style.top=cur_center+45+"px";
			left.style.clip="rect("+(-cur_center)+","+w+","+(-cur_center+3*w)+",0)";
			timecnt+=1;
			if(timecnt==50){
				end();
				clearInterval(func);
			}
		},10);
	}
	else if(moved==2){
		var v=to/50.0;
		var func=setInterval(function(){
			cur_right+=v;
			if(cur_right>=0)	cur_right-=bottom;
			left.style.top=cur_right+45+"px";
			left.style.clip="rect("+(-cur_right)+","+w+","+(-cur_right+3*w)+",0)";
			timecnt+=1;
			if(timecnt==50){
				end();
				clearInterval(func);
			}
		},10);
	}
}

function end(){	
	
	document.getElementById("light1").src="pushed_btn.png";
	document.getElementById("light2").src="pushed_btn.png";
	document.getElementById("light3").src="pushed_btn.png";
	document.getElementById("light4").src="pushed_btn.png";
	document.getElementById("light5").src="pushed_btn.png";
	left_assist.style.width="0px";
	center_assist.style.width="0px";
	right_assist.style.width="0px";
	
	/*
	left: 	rep(0)		2,7,11,16,19,
		orange(1)	1,6,9,13,17,
		watermelon(2)	15,20
		apple(3)	8,
		bell(4)		10,12,
		grape(5)	14,21
		cherry(6)	18
		bar(7)		4,5
		seven(8)	3
	*/
	var index_left=Math.floor(-cur_left/w+1e-6);
	var up_left=array_left[index_left];
	var mid_left=array_left[(index_left+1)%21];
	var low_left=array_left[(index_left+2)%21];
	/*
	center:	rep(0)		3,8,13,18,21
		orange(1)	1,6,11,16,19,
		watermelon(2)	9,10,
		apple(3)	15,
		bell(4)		12,
		grape(5)	14,20,
		cherry(6)	5,
		bar(7)		7,17,
		seven(8)	2,4,
	*/
	var index_center=Math.floor(-cur_center/w+1e-6);
	var up_center=array_center[index_center];
	var mid_center=array_center[(index_center+1)%21];
	var low_center=array_center[(index_center+2)%21];
	/*
	right: 	rep(0)		4,6,10,14,18,21
		orange(1)	1,5,9,13,17,
		watermelon(2)	2,8,
		apple(3)	11,
		bell(4)		12,
		grape(5)	15,20,
		cherry(6)	19,
		bar(7)		7,16,
		seven(8)	3,
	*/
	var index_right=Math.floor(-cur_right/w+1e-6);
	var up_right=array_right[index_right];
	var mid_right=array_right[(index_right+1)%21];
	var low_right=array_right[(index_right+2)%21];
	
	var add=0;
	var gorep=false;
	var gobonus=false;
	var ramp=[false,false,false,false,false];
	var sound=[false,false,false,false,false,false,false,false,false];
	
	//mid-mid-mid
	if(equals(mid_left,mid_center,mid_right)){
		ramp[2]=true;
		sound[mid_left]=true;
		
		if(mid_left==0){
			gorep=true;
			if(bonus){
				add+=use*5;
			}
		}
		else if(mid_left==1){
			add+=use*5;
		}
		else if(mid_left==2){
			wame_cnt=Math.max(5,wame_cnt+1);
			add+=use*5;
		}
		else if(mid_left==5){
			time_left+=5;
			add+=use*5;
		}
		else if(mid_left==6){
			chry_cnt=Math.max(5,chry_cnt+1);
			add+=use*5;
		}
		else if(mid_left>=7){
			gobonus=true;
			add+=use*25;
		}
		else{
			add+=use*5;
		}
	}
	//up-up-up
	else if(equals(up_left,up_center,up_right)){
		ramp[1]=true;
		sound[up_left]=true;
		
		if(up_left==0){
			gorep=true;
			if(bonus){
				add+=use*5;
			}
		}
		else if(up_left==2){
			wame_cnt=Math.max(5,wame_cnt+1);
			add+=use*5;
		}
		else if(up_left==5){
			time_left+=5;
			add+=use*5;
		}
		else if(up_left==6){
			chry_cnt=Math.max(5,chry_cnt+1);
			aded+=use*5;
		}
		else if(up_left>=7){
			gobonus=true;
			add+=use*25;
		}
		else{
			add+=use*5;
		}
	}
	//low-low-low
	else if(equals(low_left,low_center,low_right)){
		ramp[3]=true;
		sound[low_left]=true;		
		
		if(low_left==0){
			gorep=true;
			if(bonus){
				add+=use*5;
			}
		}
		else if(low_left==2){
			wame_cnt=Math.max(5,wame_cnt+1);
			add+=use*5;
		}
		else if(low_left==5){
			time_left+=5;
			add+=use*5;
		}
		else if(low_left==6){
			chry_cnt=Math.max(5,chry_cnt+1);
			add+=use*5;
		}
		else if(low_left>=7){
			gobonus=true;
			add+=use*25;
		}
		else{
			add+=use*5;
		}
	}
	//up-mid-low
	else if(equals(up_left,mid_center,low_right)){
		ramp[0]=true;
		sound[up_left]=true;
		
		if(up_left==0){
			gorep=true;
			if(bonus){
				add+=use*5;
			}
		}
		else if(up_left==2){
			wame_cnt=Math.max(5,wame_cnt+1);
			add+=use*5;
		}
		else if(up_left==5){
			time_left+=5;
			add+=use*5;
		}
		else if(up_left==6){
			chry_cnt=Math.max(5,chry_cnt+1);
			add+=use*5;
		}
		else if(up_left>=7){
			gobonus=true;
			add+=use*25;
		}
		else{
			add+=use*5;
		}
	}
	//low-mid-up
	else if(equals(low_left,mid_center,up_right)){
		ramp[4]=true;
		sound[low_left]=true;
		if(low_left==0){
			gorep=true;
			if(bonus){
				add+=use*5;
			}
		}
		else if(low_left==2){
			wame_cnt=Math.max(5,wame_cnt+1);
			add+=use*5;
		}
		else if(low_left==5){
			time_left+=5;
			add+=use*5;
		}
		else if(low_left==6){
			chry_cnt=Math.max(5,chry_cnt+1)
			add+=use*5;
		}
		else if(low_left>=7){
			gobonus=true;
			add+=use*25;
		}
		else{
			add+=use*5;
		}
	}
	var cnt=0;
	var func=setInterval(function(){
		var i=0;
		while(i<5){
			if(ramp[i]){
				if(cnt%2==1){
					document.getElementById("light"+(i+1)).src="pushed_btn.png";
				}
				else{
					if(i==0||i==4){
						document.getElementById("light"+(i+1)).src="blue_btn.png";
					}
					else if(i==1||i==3){
						document.getElementById("light"+(i+1)).src="green_btn.png";
					}
					else{
						document.getElementById("light"+(i+1)).src="yellow_btn.png";
					}
				}
			}
			i++;
		}
		cnt++;
		if(cnt==9)	clearInterval(func);
	},50);
	
	if(add>0){
		if(add>=use*25){
			document.getElementById("Pay_BIG").play();
			money+=add;
			money_update();
			
			if(!bonus){
				document.getElementById("back").style.background="blue";
				bonus_left=15+wame_cnt;
				bonus=true;
			}
			else{
				big_cnt+=1;
			}
		}
		else{
			if(!gorep){
				if(sound[6]){
					document.getElementById("Pay_CHERY").play();
				}
				else if(sound[5]){
					document.getElementById("Pay_GRAPE").play();
				}
				else if(sound[4]){
					document.getElementById("Pay_BELL").play();
				}
				else if(sound[1]){
					document.getElementById("Pay_ORANGE").play();
				}
				else{
					document.getElementById("Pay_WATERAPPLE").play();
				}
			}
			money+=add;
		}
		
		money_update();
		if(money<3&&!repFlag){
			gameover_flag=true;
			setTimeout("window.alert('GAMEOVER')",1000);
			setTimeout("init()",2000);
		}
		if(time_left<=0&&!repFlag)	finish();
	}
	if(gorep){
		document.getElementById("replay").play();
		started=false;
		repFlag=true;
		flag_left=flag_center=flag_right=false;
		stop_left=stop_center=stop_right=false;
		end_left=end_center=end_right=0;
		money+=use;
		setTimeout("start()",750);
	}
	if(bonus && !gorep){
		bonus_left-=1;
		if(bonus_left<=0 || big_cnt>=3){
				document.getElementById("back").style.background="red";
				bonus=false;
				chry_cnt=0;
				wame_cnt=0;
				big_cnt=0;
				bonus_left=0;
		}
	}
	return;
}

function equals(a,b,c){
	return (a==b&&b==c?true:false);
}
/*
		rep(0)		
		orange(1)	
		watermelon(2)	
		apple(3)	
		bell(4)		
		grape(5)	
		cherry(6)	
		bar(7)		
		seven(8)	
*/

//ショートカットキーの実装
document.onkeydown=function (e) {
	switch(e.keyCode){
		case 97: stop(1);	break;
		case 98: stop(2);	break;
		case 99:	stop(3);	break;
		case 101:	start();	break;
	}
}

document.onkeyup=function (e) {
	switch(e.keyCode){
		case 97: btn_release(1);	break;
		case 98: btn_release(2);	break;
		case 99:	btn_release(3);	break;
		case 101:	btn_release(4);	break;
	}
}
