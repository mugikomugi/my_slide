$(function () {
  //要素取得object
  const slideEl = {
    panelImg: $('.panelImg'),
    thumb: $('#thumb li'),//要素格納
    thumbID: '#thumb',//タッチイベント除外用
    next: $('#next'),
    prev: $('#prev'),
    act: 'act',
    speed: 800,//スライド速度
    wait: 3000,//スライド間隔
    itemW: $('.panel'),//1枚の画像幅スライドの基準
    panel: $('.panel'),//タッチイベント領域
    swipeThreshold: 20// スワイプ判定距離(px)
  }

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
      this.itemW = slideEl.itemW;
      this.imageNum = slideEl.thumb.length;//画像枚数
      this.click = true;
      this.timerID = null;
    }

    slideW() {
      this.imgW = this.itemW.width();

      // エラーハンドリング追加
      if (!this.imgW || this.imgW === 0) {
        console.error('Failed to calculate slide width');
        // デフォルト値を設定してクラッシュを防ぐ
        this.imgW = this.itemW.width(); // または適切なフォールバック値
        return false; // エラーを示すためにfalseを返す
      }
      console.log(this.imgW);
      console.log(this.imageNum);
      return true;  // 成功時にtrueを返す
    }

    // タイマー管理を統一（クラスのメソッドとして）
    clearTimer() {
      if (this.timerID) {
        clearTimeout(this.timerID);
        this.timerID = null;
      }
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
      this.timerID = setTimeout(() => {
        this.nextSlide();
        this.slideStart();
      }, this.wait);
    }

    nextClick() {
      this.next.off('click').on('click', () => {
        this.clearTimer();
        this.nextSlide();
        this.timerID = setTimeout(() => { this.slideStart(); }, this.wait);
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
      this.prev.off('click').on('click', () => {
        this.clearTimer();
        this.prevSlide();
        this.timerID = setTimeout(() => { this.slideStart(); }, this.wait);
      });
    }

    thumbClick() {
      //サムネイルクリック
      let imgNum, imgPrev, imgNext;
      this.thumb.off('click').on('click', (e) => {
        this.clearTimer();
        if (!this.click) return; // 早期リターン
        this.click = false; // 連打防止

        // タッチ中の場合はクリックイベントを無視
        if (isTouching) {
          e.preventDefault();
          return false;
        }

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

        this.panelImg.html(imgPrev.html() + imgNum.html() + imgNext.html());
        this.timerID = setTimeout(() => { this.slideStart(); }, this.wait);
      });
    }

    init() {
      if (!this.slideW()) {
        console.error('Slide initialization failed');
        return;
      }
      this.slideStart();
      this.nextClick();
      this.prevClick();
      this.thumbClick();
    }

  }

  const slide = new WideSlide();
  slide.init();

  //リサイズ
  // リサイズのデバウンス追加
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slide.slideW();
    }, 200);
  });

  //サムネイルのaリンク無効化、ページに飛んでしまうのを防止
  //.is()メソッド（要素がセレクタにマッチするか判定）
  if (slideEl.thumb.children().is('a')) {
    $('a', slideEl.thumb).on('click', function () {
      return false;
    });
  }


  //touchイベント
  /* 変数宣言 */
  let moveX, posiX;
  let isTouching = false; // タッチ中フラグを追加

  /* 指が触れたか検知 */
  // サムネイル領域を除外
  slideEl.panel.on('touchstart', function (e) {
    // サムネイルをタッチした場合は無視
    if ($(e.target).closest(slideEl.thumbID).length > 0) {
      return;
    }
    start_check(e);
  });

  /* 指が動いたか検知 */
  slideEl.panel.on('touchmove', function (e) {
    if ($(e.target).closest(slideEl.thumbID).length > 0) {
      return;
    }
    move_check(e);
  });

  /* 指が離れたか検知 */
  slideEl.panel.on('touchend', function (e) {
    if ($(e.target).closest(slideEl.thumbID).length > 0) {
      return;
    }
    end_check(e);
  });

  //タッチ開始時の処理
  function start_check(e) {
    isTouching = true; // タッチ中フラグをON
    //タイマーストップ
    slide.clearTimer();
    /* 現在の座標取得 */
    posiX = getX(e);
    /* 移動距離状態を初期化 */
    moveX = '';
  }

  //スワイプ中の処理
  function move_check(e) {
    if (!isTouching) return; // タッチ中でなければ何もしない
    e.preventDefault();// スクロール防止
    if (posiX - getX(e) > slideEl.swipeThreshold) // swipeThreshold以上移動でスワイプと判断
    {
      /* 右→左と判断 */
      moveX = 'left';
    } else if (posiX - getX(e) < -slideEl.swipeThreshold) // swipeThreshold以上移動でスワイプと判断
    {
      /* 左→右と判断 */
      moveX = 'right';
    }
  }

  //指が離れた時の処理
  function end_check(e) {
    if (!isTouching) return;
    if (!slide.click) {
      isTouching = false; // フラグをリセット
      return;
    }

    if (moveX === 'left') {
      slide.nextSlide();
    }
    else if (moveX === 'right') {
      slide.prevSlide();
    }

    // 自動再生を再開（クラスのメソッドを使用）
    if (slideEl.autoPlay === true) {
      slide.slideStart();
    }

    // タッチ終了後、少し遅延してからフラグをリセット
    // これによりclick イベントとの競合を防ぐ
    setTimeout(() => {
      isTouching = false;
    }, 100);
  }

  function getX(e) {
    // 修正: より安全なチェック（既に良い実装）
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
      return e.originalEvent.touches[0].pageX;
    }
    return 0;
  }

});