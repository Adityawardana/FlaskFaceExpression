from flask import Flask, render_template, Response, request, url_for, flash, redirect
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired

from app import app

# class MusicForm(FlaskForm):
#     # song = StringField('song')
#     song = SelectField(
#         'Select Song',
#         choices=[('', '-- Select Song --'),
#                  ('buka semangat baru', 'Buka Semangat Baru - Ello'),
#                  ('pasti bisa', 'Pasti Bisa - Citra Scholastika'),
#                  ('lebih indah', 'Lebih Indah - Adera'),
#                  ('bahagia', 'Bahagia - GAC'),
#                  ('happy', 'Happy - Pharrel Williams'),
#                  ('sugar', 'Sugar - Maroon 5'),
#                  ('uptown funk', 'Uptown Funk - Bruno Mars'),
#                  ('selamat pagi', 'Selamat Pagi - RAN'),
#                  ('santai saja', 'Santai Saja - Saint Loco'),
#                  ('tetap semangat', 'Tetap Semangat - Bondan Prakoso'),
#
#                  ('bunda', 'Bunda - Melly Goeslaw'),
#                  ('berita kepada kawan', 'Berita Kepada Kawan - Ebiet G Ade'),
#                  ('manusia bodoh', 'Manusia Bodoh - Ada Band'),
#                  ('ayah', 'Ayah - Peterpan'),
#                  ('bukan dia tapi aku', 'Bukan Dia Tapi Aku - Judika'),
#                  ('benci untuk mencinta', 'Benci Untuk Mencinta - NAIF'),
#                  ('seperti yang kau minta', 'Seperti yang kau minta - Chrisye'),
#                  ('semua tentang kita', 'Semua Tentang Kita - Peterpan'),
#                  ('we will not go down', 'We Will Not Go Down - Michael Heart'),
#                  ('akhirnya', 'Akhirnya - Gigi')], validators=[DataRequired()]
#     )
#     submit_song = SubmitField('Select')

@app.route('/')

# @app.route('/index')
# def index():
#     user = {"nickname" : "Adit"} #temporary
#     return render_template("index.html", title="Home", user=user)

@app.route('/index')
def index():
    return render_template("index.html", title="Home")

@app.route('/face_detection_music')
def face_detection():
    return render_template("face_detection_music.html", title="Face Detection Music")

# def selected_music(form):
#     return render_template('face_detection_music.html', form=form)

# @app.route('/select_music', methods=["GET","POST"])
# def select_music():
#     form = MusicForm()
#
#
#     # if form.validate_on_submit():
#     #     flash('Song {} is playing'.format(form.song.data))
#     #     return redirect(url_for('face_detection'), form=form)
#
#     if request.method == 'POST':
#         return selected_music(form)
#         # selected_song = form.song.data
#         # print(selected_song)
#         # return redirect(url_for('face_detection'), selected_song=selected_song)
#
#     return render_template("select_music.html", title="Select Music", form=form)