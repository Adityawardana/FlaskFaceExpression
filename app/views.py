from flask import Flask, render_template, Response, request, url_for, flash, redirect
from decimal import Decimal
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired

import json
import pymysql

from app import app

@app.route('/')

@app.route('/index')
def index():
    return render_template("index.html", title="Home")

@app.route('/face_detection_music')
def face_detection():
    return render_template("face_detection_music.html", title="Face Detection Music")

@app.route('/mouthOpen', methods=['POST'])
def mouthOpen():
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    checkMouthOpen = False
    try:
        if request.method == 'POST':
            data = json.loads(request.data)
            ts = data.get('timestamp')
            mo = data.get('mouthopen')
            tsStr = str(ts)
            moStr = str(mo)
            print('ts = {}, mo = {}'.format(tsStr, moStr))
        with dbconn.cursor() as cursor:
            query = "INSERT INTO `tbl_mo` (`id_mo`, `id_session`, `ts`, `mo`) VALUES (NULL, '1', '"+tsStr+"', '"+moStr+"')"
            cursor.execute(query)
        dbconn.commit()
        checkMouthOpen= True
        return "OK"
    finally:
        dbconn.close()
        if checkMouthOpen == False:
            return "False"

@app.route('/countInterest', methods=["POST"])
def countInterest():
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    checkCountInterest = False
    try:
        with dbconn.cursor() as cursor:
            query = "SELECT * FROM `tbl_mo` WHERE `id_session` = '1' ORDER BY `ts` ASC"
            cursor.execute(query)
            data = cursor.fetchall()
            firstTs = float(data[0]["ts"])
            # print(firstTs)
            tFTS = type(firstTs)
            # print(tFTS)
            tempListMo = []

            for col in data:
                floatTs = float(col["ts"])
                floatMo = float(col["mo"])

                tempTs = floatTs - firstTs
                decNewTs = Decimal(tempTs)
                newTs = round(decNewTs,2)

                tempListMo.append(floatMo)
                # print(newTs)
            # print("Mouth Open Temp : ")
            # print(tempListMo[1])
            # print("-------------------------------")
            # print(tempListMo)

            listMo = []
            for i in range(len(tempListMo)):
                if i != 0:
                    listMoT = tempListMo[i] - tempListMo[i-1]
                    print(listMoT)
                    listMo.append(abs(listMoT))
                    print("iterasi ke %d"%i)
                    print(listMo)
                else:
                    listMo.append(abs(tempListMo[i]))
                    print(listMo)
                    print("iterasi ke %d"%i)

            print("List MO : ")
            print(listMo)
            checkCountInterest = True
            print(checkCountInterest)
            return "OK"
    finally:
        dbconn.close()
        if checkCountInterest == False:
            return "false"

@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    reg_user = False
    try:
        user = request.form['username']
        password = request.form['password']
        with dbconn.cursor() as cursor:
            query = "INSERT INTO `tbl_user` (`id_user`, `nama_user`, `password`) VALUES (NULL, '"+user+"', '"+password+"')"
            cursor.execute(query)
        dbconn.commit()
        # reg_user = True
        return "OK"
    finally:
        dbconn.close()
        return "finish"

@app.route('/signIn')
def signIn():
    return render_template('signIn.html')

@app.route('/signInUser', methods=['POST'])
def signInUser():
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    login_user = False
    try:
        with dbconn.cursor() as cursor:
            user = request.form['username']
            password = request.form['password']
            query = ""
            cursor.execute(query)
            data = cursor.fetchone()
            login_user = True
            print(login_user)
            print(data)
            if data is None:
                return "Username or Password is Wrong"
            else:
                return "Logged in successfully"
    finally:
        dbconn.close()
        if login_user == False:
            return "false"

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

# @app.route('/index')
# def index():
#     user = {"nickname" : "Adit"} #temporary
#     return render_template("index.html", title="Home", user=user)

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