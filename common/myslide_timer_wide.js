//セレクタやタグをまとめて変数に代入
$(function () {

  const panel = $('.panelImg');
  let panelItem = $('.panel img');
  let imgW = panelItem.width();
  const next = $('#next');
  const prev = $('#prev');

  //サムネイルの数
  const liCount = $('#thumb').find('li').length;
  const thumbLi = $('#thumb li');
  //連打クリック禁止条件
  let click = true;

  //touchイベント領域
  const swipeEvent = $('.panel');

  //リサイズ
  $(window).on('resize', function () {
    //画像も取得しないとサイズが取れない
    panelItem = $('.panel img');
    imgW = panelItem.width();
  });

  //代入ここまで
  //サムネイルclick関数でimgをattrで入替えしているので、imgタグ以外だったら変更する

  let timerID;
  let nextImg, prevImg, cloneImg;

  //次へ
  function nextSlide() {
    //カルーセルにする為、最後のliになったら最初のliを指定
    if (thumbLi.last().hasClass('act')) {
      nextImg = thumbLi.first();
    } else {
      nextImg = $('.act').next();
    }

    if (thumbLi.eq(-2).hasClass('act')) {
      //画像クローン
      cloneImg = thumbLi.first().children().clone();
    } else {
      //画像クローンは二つ先を取得
      cloneImg = nextImg.next().children().clone();
    }

    panel.append(cloneImg);
    //actの付替え
    nextImg.addClass('act').siblings().removeClass('act');
    //スライド
    panel.stop().animate({ 'margin-left': imgW * -2 }, 800, 'swing',
      function () {
        $(this).children().first().remove();
        $(this).css('margin-left', imgW * -1);
        click = true;
      });
  }

  function slideStart() {
    nextSlide();
    timerID = setTimeout(slideStart, 3000);
  }
  //タイマー起動
  slideStart();

  next.on('click', function () {
    clearTimeout(timerID);
    if (click) {
      //スライド中クリック禁止
      click = false;
      slideStart();
    }
  });

  //前へ
  function prevSlide() {
    //最初のliになったら最後のliを指定
    if (thumbLi.first().hasClass('act')) {
      prevImg = thumbLi.last();
    } else {
      prevImg = $('.act').prev();
    }

    if (thumbLi.eq(1).hasClass('act')) {
      //画像クローン
      cloneImg = thumbLi.last().children().clone();
    } else {
      //画像クローン
      cloneImg = prevImg.prev().children().clone();
    }

    panel.prepend(cloneImg).css('margin-left', imgW * -2);
    prevImg.addClass('act').siblings().removeClass('act');
    //スライド
    panel.stop().animate({ 'margin-left': imgW * -1 }, 800, 'swing',
      function () {
        $(this).children().last().remove();
        //スライドが終わったらクリックOK
        click = true;
      });
  }

  prev.on('click', function () {
    clearTimeout(timerID);
    if (click) {
      //連打クリック禁止
      click = false;
      prevSlide();
    }
  });


  //サムネイルクリック
  let point, imgNum, imgPrev, imgNext;

  thumbLi.on('click', function () {
    clearTimeout(timerID);

    point = thumbLi.index(this);
    //クリックした場所を検索
    $(this).addClass('act').siblings().removeClass('act');

    switch (point) {
      case liCount - 1:
        imgPrev = thumbLi.eq(-2);
        imgNum = thumbLi.last();
        imgNext = thumbLi.first();
        break;
      case 0:
        imgPrev = thumbLi.last();
        imgNum = thumbLi.first();
        imgNext = thumbLi.eq(-2);
        break;
      default:
        imgPrev = thumbLi.eq(point - 1);
        imgNum = thumbLi.eq(point);
        imgNext = thumbLi.eq(point + 1);
    }

    panel.children().eq(0).attr('src', $('img', imgPrev).attr('src'));
    panel.children().eq(1).attr('src', $('img', imgNum).attr('src'));
    panel.children().eq(2).attr('src', $('img', imgNext).attr('src'));

    if (click) {
      //クリック禁止
      click = false;
      setTimeout(function () {
        slideStart();
      }, 5000);
    }
  });


  //***touchイベント カルーセルVer***
  let moveX, posiX;

  //仮引数で関数に入れて汎用化
  function swipe(touchEvent, start_check, move_check, end_check) {

    //指が触れたか検知
    touchEvent.on('touchstart', start_check);

    //指が動いたか検知
    touchEvent.on('touchmove', move_check);

    //指が離れたか検知
    touchEvent.on('touchend', end_check);

  }

  //タッチ開始時の処理
  function startSwipe(e) {
    clearTimeout(timerID);
    //現在の座標取得/
    posiX = getX(e);
    //移動距離状態を初期化/
    moveX = '';
  }

  //スワイプ中の処理
  function moveSwipe(e) {
    if (posiX - getX(e) > 20) { // 20px以上移動でスワイプと判断
      // 右→左と判断
      moveX = 'left';
    } else if (posiX - getX(e) < -20) { // 20px以上移動でスワイプと判断
      //左→右と判断
      moveX = 'right';
    }
  }

  //指が離れた時の処理
  function endSwipe(e) {
    if (moveX == 'left') {
      nextSlide(e);
    }
    else if (moveX == 'right') {
      prevSlide(e);
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

  //スワイプ実行
  swipe(swipeEvent, startSwipe, moveSwipe, endSwipe);

});
