$(function () {
  //要素取得object
  const slideEl = {
    slideBox: $('.slideBox'),
    panelImg: $('.panelImg'),
    next: $('#next'),
    prev: $('#prev'),
    thumb: $('#thumb li'),
    act: 'act'
  }
  let timerID;

  //class宣言
  class Slide {
    constructor() {
      this.slideBox = slideEl.slideBox;
      this.imgW = 0;
      this.panelImg = slideEl.panelImg;
      this.thumb = slideEl.thumb;
      this.act = slideEl.act;
      this.next = slideEl.next;
      this.prev = slideEl.prev;
    }

    slideW() {
      if (window.innerWidth > 768) {
        this.imgW = $('img', this.panelImg).width();
      } else {
        this.imgW = $(window).width();
      }
      this.panelImg.width(this.imgW * 2);
      this.slideBox.width(this.imgW);
      console.log(this.imgW);
    }

    //次へ
    nextSlide() {
      let nextImg, cloneImg;
      //カルーセルにする為、最後のliになったら最初のliを指定
      if (this.thumb.last().hasClass(this.act)) {
        nextImg = this.thumb.first();
      } else {
        nextImg = $('.' + this.act).next();
      }
      //画像クローン
      cloneImg = nextImg.children('img').clone();
      this.panelImg.append(cloneImg);
      //actの付替え
      nextImg.addClass(this.act).siblings().removeClass(this.act);
      //スライド
      this.panelImg.stop().animate({ 'margin-left': this.imgW * -1 }, 800,
        () => {
          $('img', this.panelImg).first().remove();
          this.panelImg.css('margin-left', 0);
        });
    }

    //前へ
    prevSlide() {
      let prevImg, cloneImg;
      //最初のliになったら最後のliを指定
      if (this.thumb.first().hasClass(this.act)) {
        prevImg = this.thumb.last();
      } else {
        prevImg = $('.' + this.act).prev();
      }
      //画像クローン
      cloneImg = prevImg.children('img').clone();
      this.panelImg.prepend(cloneImg).css('margin-left', this.imgW * -1);
      prevImg.addClass(this.act).siblings().removeClass(this.act);
      //スライド
      this.panelImg.stop().animate({ 'margin-left': 0 }, 800,
        () => {
          $('img', this.panelImg).last().remove();
        });
    }

    //サムネイルクリック
    clickThumb() {
      this.thumb.on('click', (e) => {
        // 既存のタイマーを止める
        clearTimeout(timerID);
        let point = this.thumb.index(e.currentTarget);
        //e.currentTargetでクリックした要素を取得、thisと同じ作用、引数eはイベントオブジェクト、イベントを指定した要素だよ、いろんな情報が入ってるよ
        this.thumb.eq(point)
          .addClass(this.act)
          .siblings()
          .removeClass(this.act);
        let imgNum = this.thumb.eq(point);
        $('img', this.panelImg).attr('src', $('img', imgNum).attr('src'));
        // タイマー再開（this を保持するためアロー関数で呼ぶ）
        timerID = setTimeout(() => { this.nextSlide(); }, 3000);
      });
    }

    init() {
      this.slideW();
      this.clickThumb();
      return this;
    }
  }

  const slide = new Slide();
  const beginning = slide.init();

  $(window).on('resize', () => {
    slide.slideW();
  });

  function slideStart() {
    slide.nextSlide();
    timerID = setTimeout(slideStart, 3000);
  }
  //タイマー起動
  slideStart();

  slideEl.next.on('click', () => {
    clearTimeout(timerID);
    slideStart();
  });

  slideEl.prev.on('click', () => {
    clearTimeout(timerID);
    slide.prevSlide();
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
    if (moveX == 'left') {
      nextSlide();
    }
    else if (moveX == 'right') {
      prevSlide();
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

});