$(function(){
  const panelImg = $('.panelImg');
  const next = $('#next');
  const prev = $('#prev');
  let imgW = $('img',panelImg).width();

//リサイズ
  $(window).on('load resize',function(){
    imgW = $('img',panelImg).width();
  });

  let timerID;
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

    if($('#thumb li:nth-last-child(2)').hasClass('act')){
      //画像クローン
      cloneImg = $('#thumb li:first-child').children('img').clone();
    } else {
    //画像クローンは二つ先を取得
      cloneImg = $(nextImg).next().children('img').clone();
    }

    panelImg.append(cloneImg);
    //actの付替え
    $(nextImg).addClass('act').siblings().removeClass('act');
    //スライド
    panelImg.stop().animate({'margin-left': imgW * -2},800,'swing',
    function(){
      $('img:first-child',this).remove();
      $(this).css('margin-left', imgW * -1);
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

    if($('#thumb li:nth-child(2)').hasClass('act')){
      //画像クローン
      cloneImg = $('#thumb li:last-child').children('img').clone();
    } else {
      //画像クローン
      cloneImg = $(prevImg).prev().children('img').clone();
    }

    panelImg.prepend(cloneImg).css('margin-left',imgW * -2);
    $(prevImg).addClass('act').siblings().removeClass('act');
    //スライド
    panelImg.stop().animate({'margin-left': imgW * -1},800,'swing',
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
  let point,imgNum,imgPrev,imgNext;
  //サムネイルの数
  const liCount = $('#thumb').find('li').length;

  $('#thumb li').on('click',function(){
    clearTimeout(timerID);

      point = $('#thumb li').index(this);
      //クリックした場所を検索
      $(this).addClass('act').siblings().removeClass('act');

      switch(point){
        case liCount - 1:
          imgPrev = $('#thumb li:nth-last-child(2)');
          imgNum = $('#thumb li:last-child');
          imgNext = $('#thumb li:first-child');
          break;
        case 0 :
          imgPrev = $('#thumb li:last-child');
          imgNum = $('#thumb li:first-child');
          imgNext = $('#thumb li:nth-child(2)');
        break;
        default:
          imgPrev = $('#thumb li').eq(point-1);
          imgNum = $('#thumb li').eq(point);
          imgNext = $('#thumb li').eq(point+1);
      }
      console.log(point);

      $('img',panelImg).eq(0).attr('src',$('img',imgPrev).attr('src'));
      $('img',panelImg).eq(1).attr('src',$('img',imgNum).attr('src'));
      $('img',panelImg).eq(2).attr('src',$('img',imgNext).attr('src'));

      if(click) {
        //クリック禁止
        click=false;
        setTimeout(function(){
          slideStart();
        }, 5000 );
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
        nextSlide(e);
      }
      else if (moveX == 'right')
      {
        prevSlide(e);
      }
    }

    function getX(e) {
      //横方向の座標を取得
      return e.originalEvent.touches[0].pageX;
    }

});