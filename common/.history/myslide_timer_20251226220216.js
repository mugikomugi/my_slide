$(function () {
  //要素取得object
  const slideEl = {
    slideBox: $('.slideBox'),
    panelImg: $('.panelImg'),
    next: $('#next'),
    prev: $('#prev'),
    thumb: $('#thumb li'),
    act: 'act',
    autoPlay: true,//自動再生ON/OFF
    panel: $('.panel')
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
      this.autoPlay = slideEl.autoPlay;
      this.click = true;
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
      if (this.click === true) {
        this.click = false;
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
            //スライドが終わったらクリックOK
            this.click = true;
          });
      }
    }

    //前へ
    prevSlide() {
      let prevImg, cloneImg;
      if (this.click === true) {
        this.click = false;
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
            //スライドが終わったらクリックOK
            this.click = true;
          });
      }
    }

    slideStart() {
      //自動スライド
      if (this.autoPlay === true) {
        this.nextSlide();
        timerID = setTimeout(() => { this.slideStart(); }, 3000);
      }
    }

    nextClick() {
      this.next.on('click', () => {
        clearTimeout(timerID);
        this.nextSlide();
      });
    }

    prevClick() {
      this.prev.on('click', () => {
        clearTimeout(timerID);
        this.prevSlide();
      });
    }

    //サムネイルクリック
    clickThumb() {
      this.thumb.on('click', (e) => {
        // 既存のタイマーを止める
        clearTimeout(timerID);
        if (this.click === true) {
          this.click = false;
          let point = this.thumb.index(e.currentTarget);
          this.thumb.eq(point)
            .addClass(this.act)
            .siblings()
            .removeClass(this.act);
          let imgNum = this.thumb.eq(point);
          $('img', this.panelImg).attr('src', $('img', imgNum).attr('src'));

          timerID = setTimeout(() => { this.nextSlide(); }, 3000);
          this.click = true;
        }
      });
    }

    init() {
      this.slideW();
      this.clickThumb();
      this.nextClick();
      this.prevClick();
      this.slideStart();
      return this;
    }
  }

  const slide = new Slide();
  const beginning = slide.init();

  $(window).on('resize', () => {
    slide.slideW();
  });



  //touchイベント
  /* 変数宣言 */
  let moveX, posiX;

  /* 指が触れたか検知 */
  slideEl.panel.on('touchstart', start_check);

  /* 指が動いたか検知 */
  slideEl.panel.on('touchmove', move_check);

  /* 指が離れたか検知 */
  slideEl.panel.on('touchend', end_check);

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
      slide.nextSlide();
    }
    else if (moveX == 'right') {
      slide.prevSlide();
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

});