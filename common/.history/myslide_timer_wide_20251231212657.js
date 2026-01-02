$(function () {
  //要素取得object
  const slideEl = {
    panelImg: $('.panelImg'),
    thumb: $('#thumb li'),//画像格納
    next: $('#next'),
    prev: $('#prev'),
    act: 'act',
    speed: 800,//スライド速度
    wait: 3000,//スライド間隔
    panel: $('.panel')//タッチイベント領域
  }
  let timerID;

  class WideSlide {
    constructor() {
      this.panelImg = slideEl.panelImg;
      this.thumb = slideEl.thumb;
      this.next = slideEl.next;
      this.prev = slideEl.prev;
      this.act = slideEl.act;
      this.speed = slideEl.speed;
      this.wait = slideEl.wait;
      this.imgW = 0;
      this.imageNum = slideEl.thumb.length;//画像枚数
      this.click = true;
    }

    slideW() {
      this.imgW = $('img', this.panelImg).width();
      console.log(this.imgW);
      console.log(this.imageNum);
    }

    //次へ
    nextSlide() {
      let nextImg, cloneImg;
      //カルーセルにする為、最後のliになったら最初のliを指定
      if (this.click === true) {
        this.click = false;
        if (this.thumb.last().hasClass(this.act)) {
          nextImg = this.thumb.first();
        } else {
          nextImg = this.thumb.filter('.' + this.act).next();
        }

        if (this.thumb.eq(this.thumb.length - 2).hasClass(this.act)) {
          //要素クローン
          cloneImg = this.thumb.first().children().clone();
        } else {
          //要素クローンは二つ先を取得
          cloneImg = nextImg.next().children().clone();
        }
        this.panelImg.append(cloneImg);
        //actの付替え
        nextImg.addClass(this.act).siblings().removeClass(this.act);
        //スライド
        this.panelImg.stop().animate({ 'margin-left': this.imgW * -2 }, this.speed,
          () => {
            this.panelImg.children().first().remove();
            this.panelImg.css('margin-left', this.imgW * -1);
            this.click = true;
          });
      }
    }

    slideStart() {
      timerID = setTimeout(() => {
        this.nextSlide();
        this.slideStart();
      }, this.wait);
    }

    nextClick() {
      this.next.on('click', () => {
        clearTimeout(timerID);
        this.nextSlide();
        timerID = setTimeout(() => { this.slideStart(); }, this.wait);
      });
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
          prevImg = this.thumb.filter('.' + this.act).prev();
        }

        if (this.thumb.eq(1).hasClass(this.act)) {
          //要素クローン
          cloneImg = this.thumb.last().children().clone();
        } else {
          //要素クローン
          cloneImg = prevImg.prev().children().clone();
        }

        this.panelImg.prepend(cloneImg).css('margin-left', this.imgW * -2);
        prevImg.addClass(this.act).siblings().removeClass(this.act);
        //スライド
        this.panelImg.stop().animate({ 'margin-left': this.imgW * -1 }, this.speed,
          () => {
            this.panelImg.children().last().remove();
            //スライドが終わったらクリックOK
            this.click = true;
          });
      }
    }

    prevClick() {
      this.prev.on('click', () => {
        clearTimeout(timerID);
        this.prevSlide();
        timerID = setTimeout(() => { this.slideStart(); }, this.wait);
      });
    }

    thumbClick() {
      //サムネイルクリック
      let imgNum, imgPrev, imgNext;
      this.thumb.on('click', (e) => {
        clearTimeout(timerID);
        let point = this.thumb.index(e.currentTarget);
        //クリックした場所を検索
        this.thumb.eq(point).addClass(this.act).siblings().removeClass(this.act);

        switch (point) {
          case this.imageNum - 1:
            imgPrev = this.thumb.eq(this.thumb.length - 2);
            imgNum = this.thumb.last();
            imgNext = this.thumb.first();
            break;
          case 0:
            imgPrev = this.thumb.last();
            imgNum = this.thumb.first();
            imgNext = this.thumb.eq(1);
            break;
          default:
            imgPrev = this.thumb.eq(point - 1);
            imgNum = this.thumb.eq(point);
            imgNext = this.thumb.eq(point + 1);
        }

        this.panelImg.find().eq(0).html(imgPrev.html());
        this.panelImg.find().eq(1).html(imgNum.html());
        this.panelImg.find().eq(2).html(imgNext.html());

        timerID = setTimeout(() => { this.slideStart(); }, this.wait);
      });
    }

    init() {
      this.slideW();
      this.slideStart();
      this.nextClick();
      this.prevClick();
      this.thumbClick();
    }

  }

  const slide = new WideSlide();
  slide.init();

  //リサイズ
  $(window).on('resize', function () {
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
    // スライドしてもしなくても、自動再生を再開
    timerID = setTimeout(() => {
      slide.slideStart();
    }, slide.wait);
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

});