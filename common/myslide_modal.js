//touchイベントとモーダル
$(function(){
  const panelImg = $('.panelImg');

  //連打クリック禁止条件
  let click = true;
  const next = $('#next');
  const prev = $('#prev');
  let nextImg, prevImg;

  //次へ
  function nextSlide(){
    nextImg = $('.act').next();
    $('img',panelImg).attr('src',$('img',nextImg).attr('src'));
    $('#modal_contents').html($('.modal_text',nextImg).html());
    $(nextImg).addClass('act').siblings().removeClass('act');
  }

  next.on('click',function(){
    nextSlide();
    //ナビの表示非表示
    navChange();
  });

  //前へ
  function prevSlide(){
    prevImg = $('.act').prev();
    $('img',panelImg).attr('src',$('img',prevImg).attr('src'));
    $('#modal_contents').html($('.modal_text',prevImg).html());
    $(prevImg).addClass('act').siblings().removeClass('act');
  }

  prev.on('click',function(){
    prevSlide();
    //ナビの表示非表示
    navChange();
  });

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
      $('img',panelImg).attr('src',$('img',imgNum).attr('src'));
      $('#modal_contents').html($('.modal_text',imgNum).html());
      $('#overlay').stop().fadeIn(800,
      function(){
        click = true;
      });
      navChange();
    }
  });

  //閉じる
  $('#close_modal').on('click',function(){
    $('#overlay').stop().fadeOut(600);
  });


  //touchイベント
    /** 変数宣言 */
    let moveX, posiX;

    /** 指が触れたか検知 */
    $('#slidePanel').on('touchstart', start_check);

    /** 指が動いたか検知 */
    $('#slidePanel').on('touchmove', move_check);

    /** 指が離れたか検知 */
    $('#slidePanel').on('touchend', end_check);

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