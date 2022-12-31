# my_slide
## オリジナルスライド
**フォルダ内容**

| ファイル名 | 摘要 
|--|--
|touch.html| 手動スライド
|touch_timer.html|自動スライド
|touch_timer_wide.html|横幅100%自動スライド
|touch_modal.html|モーダルスライド
|commonフォルダ<br>myslide.js<br>myslide.css<br>myslide_timer.js<br>myslide_timer.css<br>myslide_timer_wide.js<br>myslide_timer_wide.css<br>myslide_modal.js<br>myslide_modal.css<br>jquery-3.6.0.min.js<br>jquery.easing.1.3.js | <br>手動スライドjs<br>手動スライドcss<br>自動スライドjs<br>自動スライドcss<br>横幅100%自動スライドjs<br>横幅100%自動スライドcss<br>モーダルスライドjs<br>モーダルスライドcss<br>jQuery<br>移動動作用プラグイン
|imageフォルダ|画像格納


### 手動スライド
- touch.html
- myslide.css
- myslide.js

サンプルサイト
https://gallery.okamechan.com/slide/touch.html

スライド領域はデフォルトとして画像は一つのみ。<br>サムネイルliにimg画像を格納して非表示にしています。<br>選択されているサムネイルにactクラスを付与して、スライド画像と紐付けをしています。<br><br>
サムネをクリックしたら選択したliにactが付き、非表示になっている画像がスライドされる画像として配置されanimateで移動します。<br><br>
デバイスがスマホ時にtouchイベントが発火します。<br>
最初と最後にスライド制限をかけました。条件分岐でprevとnextボタンの表示を切り分けています。
<pre><code>if (posiX - getX(e) > 20) // 10px以上移動でスワイプと判断
  {
  if($('#thumb li:last-child').hasClass('act')){
  //画像が最後だったら移動しない
    moveX = 'stop';
    } else {
    moveX = 'left';
    }
  } else if (posiX - getX(e) < -20)  // 20px以上移動でスワイプと判断
  {
if($('#thumb li:first-child').hasClass('act')){
    //画像が最初だったら移動しない
    moveX = 'stop';
    } else {
    moveX = 'right';
    }
  }
</code></pre>
<br>

### 自動スライド
- touch_timer.html
- myslide_timer.css
- myslide_timer.js

サンプルサイト
https://gallery.okamechan.com/slide/touch_timer.html

手動スライドにタイマーを設定しました。<br>
<pre><code>function slideStart(){
      nextSlide();
      timerID = setTimeout(slideStart, 3000);
  }
  //タイマー起動
  slideStart();
</code></pre>
nextSlide()にスライド機能を組み込んでsetTimeouteで繰り返し動作をさせています。
prevとnextはそれぞれ最後と最初を繋ぎ合わせてカルーセルにしています。<br>
prevボタンのみタイマー再起動は付けませんでした。<br><br>

### 横幅100%自動スライド
- touch_timer_wide.html
- myslide_timer_wide.css
- myslide_timer_wide.js

サンプルサイト
https://gallery.okamechan.com/slide/touch_timer_wide.html

自動スライドを基盤にCSSを大幅に変えました。<br>スライド領域のデフォルト画像は3つセットにし、真ん中がアクティブになります。なので次の画像指定は2つ先のものを取得します。<br>nextメソッドを入れたセレクタを変数に代入し、再度nextメソッドを使います。<br><br>

### モーダルスライド
- touch_modal.html
- myslide_modal.css
- myslide_modal.js

サンプルサイト
https://gallery.okamechan.com/slide/touch_modal.html


手動スライドを基盤にしました。<br>サムネイルをクリックすると、モーダルウィンドウが浮かび上がります。ページめくりも実装しました。<br>attrメソッドで画像を切り替えています。また、注釈文もサムネイルにセットしておき、htmlメソッドで入れ替えています。<br>クリックされたサムネイルにactクラスを付与して取得先を指定しています。<br><br>


※スライドで使っている写真はプライベートのものなので、個人で使われるのは構いませんが商用、団体の場合はご一報いただけると嬉しいです。<br>
また、第三者の権利を侵害したり、公序良俗に反する行為を行うようなアカウントおよびサイト、ブログでのご使用は固くお断りいたします。

### 2123/01/01/js更新

変数をまとめて汎用化、」オブジェクトに挑戦してみる<br>





