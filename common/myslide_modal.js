//touchイベントとモーダル
$(function () {

  const myModal = {
    panelImg: '.panelImg',
    panelImgItem: '.panelImg img',
    img: 'img',
    modalContents: '#modal_contents',
    modalText: '.modal_text',
    act: '.act',//class名.actは絶対値で決めておく
    next: '#next',
    prev: '#prev',
    thumbLi: '#thumb li',
    liLast: '#thumb li:last-child',
    liFirst: '#thumb li:first-child',
    close: '#close_modal',
    swipeArea: '#slidePanel',
    //次へ
    //class名actは変数にせずそのまま入れた
    nextSlide: function () {
      let nextImg;
      nextImg = $(this.act).next();
      $(this.panelImgItem).attr('src', $(this.img, nextImg).attr('src'));
      $(this.modalContents).html($(this.modalText, nextImg).html());
      $(nextImg).addClass('act').siblings().removeClass('act');
    },
    //前へ
    prevSlide: function () {
      let prevImg;
      prevImg = $(this.act).prev();
      $(this.panelImgItem).attr('src', $(this.img, prevImg).attr('src'));
      $(this.modalContents).html($(this.modalText, prevImg).html());
      $(prevImg).addClass('act').siblings().removeClass('act');
    },
    itemH: function () {//モーダルコンテンツのtop値、中身により高さが違うため、padding40pxの場合
      $(this.swipeArea).css('top', ($(window).height() - ($(this.swipeArea).height() + 80)) / 2);
    },
    //ナビの処理
    navChange: function () {
      if ($(this.liLast).hasClass('act')) {
        $(this.next).css('display', 'none');
        $(this.prev).css('display', 'block');
      } else if ($(this.liFirst).hasClass('act')) {
        $(this.prev).css('display', 'none');
        $(this.next).css('display', 'block');
      } else {
        $(this.prev).css('display', 'block');
        $(this.next).css('display', 'block');
      }
    }
  }

  //連打クリック禁止条件
  let click = true;

  $(myModal.next).on('click', function () {
    myModal.nextSlide();
    myModal.itemH();
    //ナビの表示非表示
    myModal.navChange();
  });

  //前へ
  $(myModal.prev).on('click', function () {
    myModal.prevSlide();
    myModal.itemH();
    //ナビの表示非表示
    myModal.navChange();
  });

  const overlay = $('#overlay')
  //サムネイルクリック
  $(myModal.thumbLi).on('click', function () {
    let point, imgNum;
    //連打クリック禁止
    if (click == true) {
      click = false;
      point = $(myModal.thumbLi).index(this);
      //クリックした場所を検索
      $(this).addClass('act').siblings().removeClass('act');
      imgNum = $(myModal.thumbLi).eq(point);
      $(myModal.img, myModal.panelImg).attr('src', $(myModal.img, imgNum).attr('src'));
      $(myModal.modalContents).html($(myModal.modalText, imgNum).html());
      overlay.stop().fadeIn(800,
        function () {
          click = true;
        });
      myModal.navChange();
      console.log($(myModal.swipeArea).height() + 80);
      myModal.itemH();
    }
  });

  //閉じる
  $(myModal.close).on('click', function () {
    overlay.stop().fadeOut(600);
  });


  //touchイベント
  /** 変数宣言 */
  let moveX, posiX;

  /** 指が触れたか検知 */
  $(myModal.swipeArea).on('touchstart', start_check);

  /** 指が動いたか検知 */
  $(myModal.swipeArea).on('touchmove', move_check);

  /** 指が離れたか検知 */
  $(myModal.swipeArea).on('touchend', end_check);

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
      if ($(myModal.liLast).hasClass('act')) {
        //画像が最後だったら移動しない
        moveX = 'stop';
      } else {
        moveX = 'left';
      }
    } else if (posiX - getX(e) < -20)  // 10px以上移動でスワイプと判断
    {
      /** 左→右と判断 */
      if ($(myModal.liFirst).hasClass('act')) {
        //画像が最初だったら移動しない
        moveX = 'stop';
      } else {
        moveX = 'right';
      }
    }
  }

  //指が離れた時の処理
  function end_check(e) {
    if (moveX == 'left') {
      myModal.nextSlide(e);
      myModal.itemH();
      myModal.navChange();
    }
    else if (moveX == 'right') {
      myModal.prevSlide(e);
      myModal.itemH();
      myModal.navChange();
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

});
