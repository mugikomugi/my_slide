$(function(){
  let imgW;
  const panelImg = $('.panelImg');

  //スライド幅設定、PCは画像幅、スマホはデバイス幅
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

  //連打クリック禁止条件
  let click = true;
  const next = $('#next');
  const prev = $('#prev');
  let nextImg, prevImg, cloneImg;

  //次へ
  function nextSlide(){
    //連打クリック禁止
    if(click == true){
      click = false;
      nextImg = $('.act').next();
      //クローンしないと元データが消える
      cloneImg = $(nextImg).children('img').clone();
      panelImg.append(cloneImg);
      $(nextImg).addClass('act').siblings().removeClass('act');
      //スライド
      panelImg.stop().animate({'margin-left': imgW * -1},600,'swing',
      function(){
        $('img:first-child',this).remove();
        $(this).css('margin-left', 0);
        click = true;
      });
    }
  }

  next.on('click',function(){
    nextSlide();
    //ナビの表示非表示
    navChange();
  });

  //前へ
  function prevSlide(){
    //連打クリック禁止
    if(click == true){
      click = false;
      prevImg = $('.act').prev();
      cloneImg = $(prevImg).children('img').clone();
      panelImg.prepend(cloneImg).css('margin-left',imgW * -1);
      $(prevImg).addClass('act').siblings().removeClass('act');
      //スライド
      panelImg.stop().animate({'margin-left': 0},600,'swing',
      function(){
        $('img:last-child',this).remove();
        click = true;
      });
    }
  }

  prev.on('click',function(){
    prevSlide();
    //ナビの表示非表示
    navChange();
  });

  navChange();
  //ナビの処理
  function navChange(){
    if($('#thumb li:last-child').hasClass('act')) {
      next.css('display','none');
      prev.css('display','block');
    } else if($('#thumb li:first-child').hasClass('act')) {
      prev.css('display','none');
      next.css('display','block');
    } else {
      prev.css('display','block');
      next.css('display','block');
    }
  }

  //サムネイルクリック
  let point,imgNum;
  $('#thumb li').on('click',function(){
    //連打クリック禁止
    if(click == true){
      click = false;
      point = $('#thumb li').index(this);
      //クリックした場所を検索
      $(this).addClass('act').siblings().removeClass('act');
      imgNum = $('#thumb li').eq(point);
      panelImg.append('<img src="'+ $('img',imgNum).attr('src') +'" alt="">');
      panelImg.stop().animate({'margin-left': imgW * -1},600,'swing',
      function(){
        $('img:first-child',this).remove();
        $(this).css('margin-left', 0);
        click = true;
      });
      navChange();
    }
  });


  //touchイベント
    /** 変数宣言 */
    let moveX, posiX;

    /** 指が触れたか検知 */
    $('.panel').on('touchstart', start_check);

    /** 指が動いたか検知 */
    $('.panel').on('touchmove', move_check);

    /** 指が離れたか検知 */
    $('.panel').on('touchend', end_check);

    //タッチ開始時の処理
    function start_check(e) {
      /** 現在の座標取得 */
      posiX = getX(e);
      /** 移動距離状態を初期化 */
      moveX = '';
    }

    //スワイプ中の処理
    function move_check(e) {
      if (posiX - getX(e) > 20) // 10px以上移動でスワイプと判断
          {
      /** 右→左と判断 */
          if($('#thumb li:last-child').hasClass('act')){
                  //画像が最後だったら移動しない
                  moveX = 'stop';
              } else {
                  moveX = 'left';
              }
          } else if (posiX - getX(e) < -20)  // 10px以上移動でスワイプと判断
          {
          /** 左→右と判断 */
              if($('#thumb li:first-child').hasClass('act')){
                  //画像が最初だったら移動しない
                  moveX = 'stop';
              } else {
                  moveX = 'right';
              }
          }
      }

      //指が離れた時の処理
    function end_check(e) {
      if (moveX == 'left')
      {
        nextSlide(e);
        navChange();
      }
      else if (moveX == 'right')
      {
        prevSlide(e);
        navChange();
      }
    }

    function getX(e) {
      //横方向の座標を取得
      return e.originalEvent.touches[0].pageX;
    }

});