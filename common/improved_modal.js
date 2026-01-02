// タッチイベントとモーダル
$(function () {

  // 定数定義
  const SWIPE_THRESHOLD = 20; // スワイプ判定の閾値（px）
  const FADE_IN_DURATION = 800;
  const FADE_OUT_DURATION = 600;

  class MyModal {
    constructor(config) {
      this.panelImg = config.panelImg;
      this.next = config.next;
      this.prev = config.prev;
      this.activeClass = config.activeClass;
      this.modal = config.modal;
      this.thumb = config.thumb;
      this.close = config.close;
      this.modalBg = config.modalBg;
      this.modalText = config.modalText;

      this.isAnimating = false; // アニメーション中フラグ
      this.touchStartX = 0;
      this.touchMoveX = '';
    }

    // 初期化
    init() {
      this.bindEvents();
      this.navChange();
    }

    // イベントバインド
    bindEvents() {
      // サムネイルクリック
      this.thumb.on('click', (e) => this.handleThumbClick(e));

      // モーダル閉じる
      this.modalBg.on('click', () => this.closeModal());

      // ナビゲーションボタン
      this.next.on('click', () => {
        this.nextSlide();
        this.navChange();
      });

      this.prev.on('click', () => {
        this.prevSlide();
        this.navChange();
      });

      // タッチイベント
      $('#slidePanel')
        .on('touchstart', (e) => this.handleTouchStart(e))
        .on('touchmove', (e) => this.handleTouchMove(e))
        .on('touchend', (e) => this.handleTouchEnd(e));
    }

    // サムネイルクリック処理
    handleThumbClick(e) {
      if (this.isAnimating) return;

      this.isAnimating = true;
      const clickedIndex = this.thumb.index(e.currentTarget);
      const clickedThumb = this.thumb.eq(clickedIndex);

      // アクティブクラスの切り替え
      clickedThumb
        .addClass(this.activeClass)
        .siblings()
        .removeClass(this.activeClass);

      // 画像の切り替え
      const imgSrc = clickedThumb.find('img').attr('src');
      this.panelImg.find('img').attr('src', imgSrc);

      // モーダルテキストの更新
      const modalTextContent = clickedThumb.find(this.modalText).html();
      if (modalTextContent) {
        this.modal.html(modalTextContent);
      }

      // モーダル表示
      this.modalBg.stop().fadeIn(FADE_IN_DURATION, () => {
        this.isAnimating = false;
      });

      this.navChange();
    }

    // モーダルを閉じる
    closeModal() {
      this.close.stop().fadeOut(FADE_OUT_DURATION);
    }

    // ナビゲーションボタンの表示切り替え
    navChange() {
      const isLast = this.thumb.last().hasClass(this.activeClass);
      const isFirst = this.thumb.first().hasClass(this.activeClass);

      if (isLast) {
        this.next.hide();
        this.prev.show();
      } else if (isFirst) {
        this.prev.hide();
        this.next.show();
      } else {
        this.prev.show();
        this.next.show();
      }
    }

    // アクティブな要素を取得
    getActiveThumb() {
      return this.thumb.filter('.' + this.activeClass);
    }

    // 次のスライドへ
    nextSlide() {
      const activeThumb = this.getActiveThumb();
      const nextThumb = activeThumb.next();

      if (nextThumb.length === 0) return;

      const imgSrc = nextThumb.find('img').attr('src');
      this.panelImg.find('img').attr('src', imgSrc);

      const modalTextContent = nextThumb.find(this.modalText).html();
      if (modalTextContent) {
        this.modal.html(modalTextContent);
      }

      nextThumb
        .addClass(this.activeClass)
        .siblings()
        .removeClass(this.activeClass);
    }

    // 前のスライドへ
    prevSlide() {
      const activeThumb = this.getActiveThumb();
      const prevThumb = activeThumb.prev();

      if (prevThumb.length === 0) return;

      const imgSrc = prevThumb.find('img').attr('src');
      this.panelImg.find('img').attr('src', imgSrc);

      const modalTextContent = prevThumb.find(this.modalText).html();
      if (modalTextContent) {
        this.modal.html(modalTextContent);
      }

      prevThumb
        .addClass(this.activeClass)
        .siblings()
        .removeClass(this.activeClass);
    }

    // タッチ開始
    handleTouchStart(e) {
      this.touchStartX = this.getTouchX(e);
      this.touchMoveX = '';
    }

    // タッチ移動
    handleTouchMove(e) {
      const currentX = this.getTouchX(e);
      const diffX = this.touchStartX - currentX;

      if (diffX > SWIPE_THRESHOLD) {
        // 右から左へのスワイプ
        if (this.thumb.last().hasClass(this.activeClass)) {
          this.touchMoveX = 'stop';
        } else {
          this.touchMoveX = 'left';
        }
      } else if (diffX < -SWIPE_THRESHOLD) {
        // 左から右へのスワイプ
        if (this.thumb.first().hasClass(this.activeClass)) {
          this.touchMoveX = 'stop';
        } else {
          this.touchMoveX = 'right';
        }
      }
    }

    // タッチ終了
    handleTouchEnd(e) {
      if (this.touchMoveX === 'left') {
        this.nextSlide();
        this.navChange();
      } else if (this.touchMoveX === 'right') {
        this.prevSlide();
        this.navChange();
      }
    }

    // タッチのX座標を取得
    getTouchX(e) {
      return e.originalEvent.touches[0].pageX;
    }
  }

  // モーダルの設定
  const modalConfig = {
    panelImg: $('.panelImg'),
    next: $('#next'),
    prev: $('#prev'),
    activeClass: 'act',
    modal: $('#modal_contents'),
    thumb: $('#thumb li'),
    close: $('#close_modal'),
    modalBg: $('#overlay'),
    modalText: '.modal_text'
  };

  // インスタンス生成と初期化
  const myModal = new MyModal(modalConfig);
  myModal.init();
});
