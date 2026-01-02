//touchイベントとモーダル
$(function () {

  const modalItem = {
    panelImg: $('.panelImg'), //modal内の画像
    next: $('#next'), //次へボタン
    prev: $('#prev'), //前へボタン  
    act: 'act', //アクティブクラス
    thumb: $('#thumb li'), //サムネイルリストli
    modalBg: $('#overlay'), //モーダル背景
    close: $('#close_modal'), //閉じるボタン
    modal: $('#modal_contents'), //モーダルテキストブロック
    modalText: '.modal_text' //モーダルテキスト 
  };

  class MyModal {
    constructor(item) {
      this.thumb = item.thumb;
      this.panelImg = item.panelImg;
      //次へ、前へボタンがある場合のみ設定
      if (item.next && item.prev) {
        this.next = item.next;
        this.prev = item.prev;
      } else {
        this.next = null;
        this.prev = null;
      }
      this.act = item.act;
      this.modal = item.modal;
      this.close = item.close;
      this.modalBg = item.modalBg;
      this.modalText = item.modalText;
      //連打クリック禁止条件
      this.click = true;
    }

    //サムネイルクリック
    clickModal() {
      this.thumb.on('click', (e) => {
        if (this.click === true) {
          this.click = false;
          let point = this.thumb.index(e.currentTarget);
          //e.currentTargetでクリックした要素を取得、thisと同じ作用、引数eはイベントオブジェクト、イベントを指定した要素だよ、いろんな情報が入ってるよ
          this.thumb.eq(point)
            .addClass(this.act)
            .siblings()
            .removeClass(this.act);

          let imgNum = this.thumb.eq(point);
          $('img', this.panelImg).attr('src', $('img', imgNum).attr('src'));
          if (this.modal) {
            this.modal.html($('.modal_text', imgNum).html());
          }
          this.modalBg.stop().fadeIn(800, () => {
            this.click = true;
          });
        }
        if (this.next !== null && this.prev !== null) {
          //thisを付けないと「ただの関数呼び出し」になり、クラスのメソッドは見つからない
          this.navChange();
        }
      });
    }
    /*
    イベントハンドラ外では currentTargetはnullになるので、必ずイベント処理の中で使いましょう。クリック位置が細かい子要素でも、処理対象を「リスナーを付けた要素」に固定したいときに currentTarget を使う
    アロー関数では this が変わるので、event.currentTarget を使うのが安全
    */

    //閉じる
    closeModal() {
      this.close.on('click', () => {
        this.modalBg.stop().fadeOut(600);
      });
    }

    //ナビの処理

    navChange() {
      if (this.thumb.last().hasClass(this.act)) {
        this.next.hide();
        this.prev.show();
      } else if (this.thumb.first().hasClass(this.act)) {
        this.prev.hide();
        this.next.show();
      } else {
        this.prev.show();
        this.next.show();
      }
    }

    //次へ
    nextSlide() {
      const classAct = $('.' + this.act);
      let nextImg = classAct.next();
      $('img', this.panelImg).attr('src', $('img', nextImg).attr('src'));
      if (this.modal) {
        this.modal.html($(this.modalText, nextImg).html());
      }
      nextImg.addClass(this.act).siblings().removeClass(this.act);
    }
    //前へ
    prevSlide() {
      const classAct = $('.' + this.act);
      let prevImg = classAct.prev();
      $('img', this.panelImg).attr('src', $('img', prevImg).attr('src'));
      if (this.modal) {
        this.modal.html($(this.modalText, prevImg).html());
      }
      prevImg.addClass(this.act).siblings().removeClass(this.act);
    }

    clickNext() {
      if (this.next !== null && this.prev !== null) {
        this.next.on('click', () => {
          this.nextSlide();
          this.navChange();
        });
      }
    }

    clickPrev() {
      if (this.next !== null && this.prev !== null) {
        this.prev.on('click', () => {
          this.prevSlide();
          this.navChange();
        });
      }
    }

    //実行関数まとめる
    behavior() {
      this.clickModal();
      this.closeModal();
      this.clickNext();
      this.clickPrev();
    }
  }

  //モーダル本体の要素　呼び出しインスタンス
  const myModal = new MyModal(modalItem);
  myModal.behavior();

  //touchイベント
  /** 変数宣言 */
  let moveX, posiX

  /** 指が触れたか検知 */
  modalItem.modalBg.on('touchstart', start_check);

  /** 指が動いたか検知 */
  modalItem.modalBg.on('touchmove', move_check);

  /** 指が離れたか検知 */
  modalItem.modalBg.on('touchend', end_check);

  //タッチ開始時の処理
  function start_check(e) {
    /** 現在の座標取得 */
    posiX = getX(e);
    /** 移動距離状態を初期化 */
    moveX = '';
  }

  //スワイプ中の処理
  function move_check(e) {
    e.preventDefault(); //スクロール防止
    if (posiX - getX(e) > 20) // 20px以上移動でスワイプと判断
    {
      /** 右→左と判断 */
      if (modalItem.thumb.last().hasClass(modalItem.act)) {
        //画像が最後だったら移動しない
        moveX = 'stop';
      } else {
        moveX = 'left';
      }
    } else if (posiX - getX(e) < -20)  // 20px以上移動でスワイプと判断
    {
      /** 左→右と判断 */
      if (modalItem.thumb.first().hasClass(modalItem.act)) {
        //画像が最初だったら移動しない
        moveX = 'stop';
      } else {
        moveX = 'right';
      }
    }
  }

  //指が離れた時の処理
  function end_check() {
    if (moveX == 'left') {
      myModal.nextSlide();
      myModal.navChange();
    }
    else if (moveX == 'right') {
      myModal.prevSlide();
      myModal.navChange();
    }
  }

  function getX(e) {
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
      return e.originalEvent.touches[0].pageX;
    }
    return 0;
  }

});