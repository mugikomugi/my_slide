//オブジェクトで自動スライド作ってみる
$(function () {

  const panel = $('.panelImg');
  let panelItem = $('.panelImg img').width();
  let windowW = $(window);

  const next = $('#next');
  const prev = $('#prev');
  const thumbLi = $('#thumb li');
  let click = true;


  //class宣言
  class MySlide {
    constructor(panel, panelItem, windowW, next, prev, thumbLi) {
      this.panel = panel;
      this.panelItem = panelItem;
      this.windowW = windowW;
      this.next = next;
      this.prev = prev;
      this.thumbLi = thumbLi;
    }

    slidW() {
      if (window.innerWidth > 768) {
        //スライド一つ分の幅
        this.slideItemW = this.panelItem;
        //スライド領域の幅
        this.panel.width(this.slideItemW * 2);
      } else {
        this.slideItemW = this.windowW.width();
        this.panel.width(this.windowW.width() * 2);
      }
    }

  }

  const MySlider = new MySlide(panel, panelItem, windowW, next, prev, thumbLi);

  MySlider.slidW();

  //リサイズ
  $(window).on('resize', function () {
    MySlider.slidW();
  });

  let nextImg, prevImg, cloneItem;
  //次へ
  function nextSlide() {
    //カルーセルにする為、最後のliになったら最初のliを指定
    if (thumbLi.last().hasClass('act')) {
      nextImg = thumbLi.first();
    } else {
      nextImg = $('.act').next();
    }

    //クローンしないと元データが消える
    cloneItem = $(nextImg).children().clone();
    panel.append(cloneItem);
    $(nextImg).addClass('act').siblings().removeClass('act');
    //スライド
    panel.stop().animate({ 'margin-left': MySlider.slideItemW * -1 }, 600, 'swing',
      function () {
        $(this).children().first().remove();
        $(this).css('margin-left', 0);
        click = true;
      });
  }

  function slideStart() {
    nextSlide();
    timerID = setTimeout(slideStart, 3000);
  }
  //タイマー起動
  slideStart();

  //次へnavクリック
  next.on('click', function () {
    clearTimeout(timerID);
    if (click) {
      //スライド中クリック禁止
      click = false;
      slideStart();
    }
  });

  //前へnavクリック
  function prevSlide() {
    //最初のliになったら最後のliを指定
    if (thumbLi.first().hasClass('act')) {
      prevImg = thumbLi.last();
    } else {
      prevImg = $('.act').prev();
    }

    cloneImg = $(prevImg).children().clone();
    panel.prepend(cloneImg).css('margin-left', MySlider.slideItemW * -1);
    $(prevImg).addClass('act').siblings().removeClass('act');
    //スライド
    panel.stop().animate({ 'margin-left': 0 }, 600, 'swing',
      function () {
        $(this).children().last().remove();
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
  let point, imgNum;
  thumbLi.on('click', function () {
    clearTimeout(timerID);
    //連打クリック禁止
    if (click == true) {
      click = false;
      point = thumbLi.index(this);
      //クリックした場所を検索
      $(this).addClass('act').siblings().removeClass('act');
      imgNum = thumbLi.eq(point).html();
      panel.append(imgNum);
      panel.stop().animate({ 'margin-left': MySlider.slideItemW * -1 }, 600, 'swing',
        function () {
          $(this).children().first().remove();
          $(this).css('margin-left', 0);
          click = true;
        });
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

  //touchイベント領域
  const swipeEvent = $('.panel');

  //スワイプ実行
  swipe(swipeEvent, startSwipe, moveSwipe, endSwipe);

});
