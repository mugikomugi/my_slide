# my_slide_class_ver
## オリジナルスライド
my_slideをclass化して、オブジェクトの中身を変えるだけで汎用的に使えるようにしました。<br>css次第でレイアウトが変えられます。<br>

**フォルダ内容**

| ファイル名 | 摘要 
|--|--
|touch_timer.html|自動スライド
|touch_timer_wide.html|横幅100%自動スライド
|touch_modal.html|モーダルスライド
|commonフォルダ<br>myslide_timer.js<br>myslide_timer.css<br>myslide_timer_wide.js<br>myslide_timer_wide.css<br>myslide_modal.js<br>myslide_modal.css<br>jquery-3.6.0.min.js| <br>手動スライドjs<br>手動スライドcss<br>自動スライドjs<br>自動スライドcss<br>横幅100%自動スライドjs<br>横幅100%自動スライドcss<br>モーダルスライドjs<br>モーダルスライドcss<br>jQuery<br>移動動作用プラグイン
|imageフォルダ|画像格納<br>

### 自動スライド
- touch_timer.html
- myslide_timer.css
- myslide_timer.js

サンプルサイト
https://gallery.okamechan.com/slide/touch_timer.html

スライドにタイマーを設定しました。スライド動作を手動と自動で切り替えられるよう設定しました。<br>

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







