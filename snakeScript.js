$(function(){

	let playersQuanity = () => $('#players div').length
	let name = (text) => text ? $('#name').val(text) : $('#name').val()
	let choosenPawn = () => $('.pawns img.choosen')

	$('#createPanel').on('click',function(){
		$('#pawnLack').slideUp()
		$('#nameLack').slideUp()
	})

	$('.pawns img').on('click',function(){
		choosenPawn().removeClass('choosen')
		$(this).addClass('choosen')
	})

	$('#create').on('click',function(){

		if(!$('#createPanel').is(":visible")) $('#createPanel').slideDown(500)
		else{
			if(name()=='' || name()=='Player') $('#nameLack').slideDown(200)
			else if (choosenPawn().length==0) $('#pawnLack').slideDown(200)
			else $('#createPanel').slideUp(500,createPlayer)
		}

		function createPlayer(){
			$('#players').append("<div player="+playersQuanity()+">"+name()+
				"<img src="+choosenPawn().attr('src')+"></img></div>")
			$('#players div').slideDown(200)
			name('Player')
			choosenPawn().remove()
			if(playersQuanity()==1) $('#startGame').slideDown(200)
		}
	})

	$('#startGame').on('click',function(){
		hideBody()
		preparePanel()

		function hideBody(){
			$('.panel-body div:visible').slideUp(200)
			$('.panel-body button:visible').slideUp(200)
		}
		function preparePanel(){
			$('#players').slideDown(200)
			$('#players div[player=0]').slideDown(200).addClass('active')
			$('#Rollingdices').slideDown(200)
		}
	})

	$('#roll').on('click',function(){
		$("#Rollingdices").slideUp(300,rollDice)

		function rollDice(){
			$('#d1').attr('src',"d"+Math.floor((Math.random() * 6) + 1)+".png")
			$('#d2').attr('src',"d"+Math.floor((Math.random() * 6) + 1)+".png")
			$('#dices').slideDown(300)
			$("#move").attr("disabled", false)
		}
	})

	$('#move').on('click',function(){
		$("#move").attr("disabled", true)
		let playerIndex = () => Number($('#players div.active').attr('player'))
		let playerPawn = () => $("img[player="+playerIndex()+"]")
		let d1 = () => Number($('#d1').attr('src')[1])
		let d2 = () => Number($('#d2').attr('src')[1])

		if(playerPawn().length==0){
			$("#players div.active img").clone().addClass("pawn")
			.attr('player',playerIndex()).attr('way','right').appendTo($("body"))
		}

		var opposite = { left:'right',right:'left'}
		var wayValue = { left:"-=90", right:"+=90"}
		let way = (change) => change ? playerPawn().attr('way',change)
			: playerPawn().attr('way')
		var moves = d1()+d2()
		if(playerPawn().position().top==55) way('left')
		animation()

		function animation(){
			--moves
			if(moves==-1) teleport()
			else if((playerPawn().position().left<820 && way()=='right')
					 || (playerPawn().position().left>10  && way()=='left' ) ){
				playerPawn().animate({left:wayValue[way()]},200,animation)
			}
			else if(playerPawn().position().top==55){
				way('right')
				playerPawn().animate({left:"+=90"},200,animation)
			}
			else{
				way(opposite[way()])
				playerPawn().animate({top:"-=90"},200,animation)
			}
		}


		function teleport(){

			function field(left,top,way){
				this.left = left
			  this.top = top
			  this.way = way
			}

			var specialField = {'100:865': new field("+=90","-=270",'left'),
													'550:865': new field("+=0","-=90",'left'),
													'640:865': new field("+=180","-=270",'left'),
													'460:775': new field("+=0","-=90",'right'),
													'370:775': new field("+=90","+=90",'right'),
													'10:685': new field("+=90","-=180",'right'),
													'640:685': new field("-=360","-=540",'right'),
													'370:595': new field("-=90","-=90",'right'),
													'460:505': new field("-=90","+=180",'right'),
													'730:505': new field("+=90","+=270",'left'),
													'820:415': new field("-=270","-=90",'right'),
													'100:325': new field("+=0","+=450",'left'),
													'280:325': new field("-=270","+=90",'left'),
													'820:235': new field("+=0","-=180",'left'),
													'550:235': new field("+=90","+=180",'left'),
													'190:235': new field("+=0","-=180",'left'),
													'550:145': new field("+=0","-=90",'left'),
													'730:145': new field("-=90","+=180",'right'),
													'730:55': new field("-=90","+=90",'right'),
													'460:55': new field("+=0","+=180",'left'),
													'100:55': new field("-=90","+=180",'left')
			}

			let coordiantes = (playerPawn().position().left)+":"+(playerPawn().position().top)
			if(specialField[coordiantes]){
				playerPawn().css({
					'left': specialField[coordiantes].left,
					'top': specialField[coordiantes].top
				})
				way(specialField[coordiantes].way)
			}
			if(playerPawn().position().left==10 && playerPawn().position().top==55){
				$("#dices").slideUp(200,function(){
					$("#winner").slideDown(200)
				})
			}
			else nextPlayer()
		}


		function nextPlayer(){
			let next = d1()==d2() ? $("#players div.active") :
				playerIndex()+1==playersQuanity() ? $('#players div[player=0]') :
				$("#players div.active").next()
			$("#dices").slideUp(200)
			$("#players div.active").removeClass('active').slideUp(200,function(){
				next.slideDown(200).addClass('active')
				$("#Rollingdices").slideDown(200)
			})
		}
	})

})
