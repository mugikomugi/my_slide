$(function () {
  //要素取得object
  const slideEl = {
    panelImg: $('.panelImg'),//画像を二つ並べるところ
    next: $('#next'),
    prev: $('#prev'),
    thumbID: '#thumb',
    thumb: $('#thumb li'),//要素格納
    act: 'act',//マーカー
    autoPlay: true,//自動再生ON/OFF
    wait: 3000,//自動再生スピード
    speed: 800,//スライド待機時間
    itemW: $('#slidePanel'),//1枚の画像幅スライドの基準
    pointBreak: 768,//レスポンシブ切替幅 
    panel: $('.panel'),//タッチイベント領域
    timerID: null,
    swipeThreshold: 20// スワイプ判定距離(px)
  }

  //class宣言
  class Slide {
    constructor() {
      this.imgW = 0;
      this.panelImg = slideEl.panelImg;
      this.thumb = slideEl.thumb;
      this.act = slideEl.act;
      this.next = slideEl.next;
      this.prev = slideEl.prev;
      this.itemW = slideEl.itemW;
      this.autoPlay = slideEl.autoPlay;
      this.pointBreak = slideEl.pointBreak;
      this.click = true;
      this.timerID = slideEl.timerID;
    }

    slideW() {
      if (window.innerWidth > this.pointBreak) {
        this.imgW = this.itemW.width();
      } else {
        this.imgW = $(window).width();
      }

      // エラーハンドリング追加
      if (!this.imgW || this.imgW === 0) {
        console.error('Failed to calculate slide width');
        // デフォルト値を設定してクラッシュを防ぐ
        this.imgW = this.itemW.width(); // または適切なフォールバック値
        return false; // エラーを示すためにfalseを返す
      }
      console.log(this.imgW);
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
      if (!this.click) return; // 早期リターン
      this.click = false;
      //カルーセルにする為、最後のliになったら最初のliを指定
      if (this.thumb.last().hasClass(this.act)) {
        nextImg = this.thumb.first();
      } else {
        nextImg = this.thumb.filter('.' + this.act).next();
      }
      //要素クローン
      cloneImg = nextImg.children().clone();
      this.panelImg.append(cloneImg);
      //actの付替え
      nextImg.addClass(this.act).siblings().removeClass(this.act);
      //スライド
      this.panelImg.stop().animate({ 'margin-left': this.imgW * -1 }, slideEl.speed,
        () => {
          this.panelImg.children().first().remove();
          this.panelImg.css('margin-left', 0);
          //スライドが終わったらクリックOK
          this.click = true;
        });
    }

    //前へ
    prevSlide() {
      let prevImg, cloneImg;
      if (!this.click) return; // 早期リターン
      this.click = false;
      //最初のliになったら最後のliを指定
      if (this.thumb.first().hasClass(this.act)) {
        prevImg = this.thumb.last();
      } else {
        prevImg = this.thumb.filter('.' + this.act).prev();
      }
      //要素クローン
      cloneImg = prevImg.children().clone();
      this.panelImg.prepend(cloneImg).css('margin-left', this.imgW * -1);
      prevImg.addClass(this.act).siblings().removeClass(this.act);
      //スライド
      this.panelImg.stop().animate({ 'margin-left': 0 }, slideEl.speed,
        () => {
          this.panelImg.children().last().remove();
          //スライドが終わったらクリックOK
          this.click = true;
        });
    }

    slideStart() {
      //自動スライド
      if (this.autoPlay === true) {
        this.timerID = setTimeout(() => {
          this.nextSlide();
          this.slideStart();
        }, slideEl.wait);
      }
    }

    nextClick() {
      //off()で重複防止
      this.next.off('click').on('click', () => {
        this.clearTimer();
        this.nextSlide();
        if (this.autoPlay === true) {
          this.slideStart();
        }
      });
    }

    prevClick() {
      this.prev.off('click').on('click', () => {
        this.clearTimer();
        this.prevSlide();
        if (this.autoPlay === true) {
          this.slideStart();
        }
      });
    }

    //サムネイルクリック
    clickThumb() {
      // off()で重複防止
      this.thumb.off('click').on('click', (e) => {
        // タッチ中の場合はクリックイベントを無視
        if (isTouching) {
          e.preventDefault();
          return false;
        }

        this.clearTimer();
        if (!this.click) return; // 早期リターン

        this.click = false;
        let point = this.thumb.index(e.currentTarget);

        this.thumb.eq(point)
          .addClass(this.act)
          .siblings()
          .removeClass(this.act);

        let imgNum = this.thumb.eq(point);
        this.panelImg.html(imgNum.html());

        if (this.autoPlay === true) {
          this.slideStart();
        }
        this.click = true;
      });
    }

    init() {
      if (!this.slideW()) {
        console.error('Slide initialization failed');
        return;
      }
      this.clickThumb();
      this.nextClick();
      this.prevClick();
      this.slideStart();
    }
  }

  const slide = new Slide();
  slide.init();

  // リサイズ処理（既に良い実装）
  let resizeTimer;
  $(window).on('resize', () => {
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

  // タッチイベントの end_check 関数
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
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
      return e.originalEvent.touches[0].pageX;
    }
    return 0;
  }

});