$(function(){
  let imgW;
  const panelImg = $('.panelImg');

  //スライド幅取得、PCは画像幅、スマホはデバイス幅
  function slideW(){
    if(window.innerWidth > 768) {
      imgW = $('img',panelImg).width();
    } else {
      imgW = $(window).width();
    }
  }
  slideW();
  panelImg.width(imgW * 2);

//リサイズ
  $(window).on('resize',function(){
    slideW();
    panelImg.width(imgW * 2);
  });

  let timerID;
  const next = $('#next');
  const prev = $('#prev');
  let nextImg, prevImg, cloneImg;

  //連打クリック禁止条件
  let click = true;

  function slideStart(){
      nextSlide();
      timerID = setTimeout(slideStart, 3000);
  }
  //タイマー起動
  slideStart();

  //次へ
  function nextSlide(){
    //カルーセルにする為、最後のliになったら最初のliを指定
    if($('#thumb li:last-child').hasClass('act')){
      nextImg = $('#thumb li:first-child');
    } else {
      nextImg = $('.act').next();
    }
    //画像クローン
    cloneImg = $(nextImg).children('img').clone();
    panelImg.append(cloneImg);
    //actの付替え
    $(nextImg).addClass('act').siblings().removeClass('act');
    //スライド
    panelImg.stop().animate({'margin-left': imgW * -1},600,'swing',
    function(){
      $('img:first-child',this).remove();
      $(this).css('margin-left', 0);
      //スライドが終わったらクリックOK
      click = true;
    });
  }
  
  next.on('click',function(){
    clearTimeout(timerID);
    if(click) {
      //スライド中クリック禁止
      click=false;
      slideStart();
    }
  });

  //前へ
  function prevSlide(){
    //最初のliになったら最後のliを指定
    if($('#thumb li:first-child').hasClass('act')){
      prevImg = $('#thumb li:last-child');
    } else {
      prevImg = $('.act').prev();
    }
    //画像クローン
    cloneImg = $(prevImg).children('img').clone();
    panelImg.prepend(cloneImg).css('margin-left',imgW * -1);
    $(prevImg).addClass('act').siblings().removeClass('act');
    //スライド
    panelImg.stop().animate({'margin-left': 0},600,'swing',
    function(){
      $('img:last-child',this).remove();
      //スライドが終わったらクリックOK
      click = true;
    });
  }

  prev.on('click',function(){
    clearTimeout(timerID);
    if(click) {
      //連打クリック禁止
      click=false;
      prevSlide();
    }
  });


  //サムネイルクリック
  let point,imgNum;
  $('#thumb li').on('click',function(){
    clearTimeout(timerID);
    if(click) {
      //連打クリック禁止
      click=false;
      point = $('#thumb li').index(this);
      //クリックした場所を検索
      $(this).addClass('act').siblings().removeClass('act');
      imgNum = $('#thumb li').eq(point);
      panelImg.append('<img src="'+ $('img',imgNum).attr('src') +'" alt="">');
      panelImg.stop().animate({'margin-left': imgW * -1},600,'swing',
      function(){
        $('img:first-child',this).remove();
        $(this).css('margin-left', 0);
        //5秒後にスタート
        setTimeout(function(){
          slideStart();
        }, 5000);
      });
    }
  });


  //touchイベント
    /* 変数宣言 */
    let moveX, posiX;

    /* 指が触れたか検知 */
    $('.panel').on('touchstart', start_check);

    /* 指が動いたか検知 */
    $('.panel').on('touchmove', move_check);

    /* 指が離れたか検知 */
    $('.panel').on('touchend', end_check);

    //タッチ開始時の処理
    function start_check(e) {
      //タイマーストップ
      clearTimeout(timerID);
      /* 現在の座標取得 */
      posiX = getX(e);
      /* 移動距離状態を初期化 */
      moveX = '';
    }

    //スワイプ中の処理
    function move_check(e) {
      if (posiX - getX(e) > 20) // 20px以上移動でスワイプと判断
          {
          /* 右→左と判断 */
            moveX = 'left';
          } else if (posiX - getX(e) < -20) // 20px以上移動でスワイプと判断
          {
          /* 左→右と判断 */
            moveX = 'right';
          }
        }

      //指が離れた時の処理
    function end_check(e) {
      if (moveX == 'left')
      {
        nextSlide();
      }
      else if (moveX == 'right')
      {
        prevSlide();
      }
    }

    function getX(e) {
      //横方向の座標を取得
      return e.originalEvent.touches[0].pageX;
    }

});