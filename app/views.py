from flask import Flask, render_template, Response, request, url_for, flash, redirect, json, session, jsonify
from decimal import Decimal
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired

import json
import pymysql
import datetime
import time

from app import app

@app.route('/')
@app.route('/index')
def index():
    if not session.get('logged_in'):
        return render_template("index.html", title="Home")
    else:
        return render_template("index_home.html", title="Index Home")

@app.route('/face_detection_music')
def face_detection():
    if session.get('logged_in'):
        return render_template("face_detection_music.html", title="Face Detection Music")
    else:
        return redirect(url_for('index'))

@app.route('/mouthOpen', methods=['POST'])
def mouthOpen():
    idSession = session.get('id_session')
    print(idSession)
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
                query = "INSERT INTO `tbl_mo` (`id_session`, `ts`, `mo`) VALUES (%s, %s, %s)"
                # query = "INSERT INTO `tbl_mo` (`id_mo`, `id_session`, `ts`, `mo`) VALUES (NULL, '"+idSession+"', '"+tsStr+"', '"+moStr+"')"
                cursor.execute(query, (str(idSession), tsStr, moStr))
            dbconn.commit()
            checkMouthOpen= True
            return "OK"
    except Exception as err:
        print(err)
    finally:
        dbconn.close()
        if checkMouthOpen == False:
            return "False"

@app.route('/countInterest', methods=['GET', 'POST'])
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
            idSession = session.get('id_session')
            print(idSession)
            query = "SELECT * FROM `tbl_mo` WHERE `id_session` = %s ORDER BY `ts` ASC"
            cursor.execute(query, (idSession,))
            data = cursor.fetchall()
            print(data)
            checkCountInterest = True
            print(checkCountInterest)

            if len(data) is 0:
                result = {'success': False, 'url': None, 'message': 'Data Tabel mo Kosong'}
                return jsonify(result)
            else:
                result = {'success': True, 'url': '/graphResult', 'message': 'Success', 'dataInterestValue': data}
                # 'id_session': data["id_session"], 'time': data["ts"],
                #                           'mo': data["mo"],
                return jsonify(result)
            # return render_template('graphResult.html', listTs = listTs, listMo = listMo)
    except Exception as err:
        print(err)
        return "error"
    finally:
        dbconn.close()
        if checkCountInterest == False:
            return "false"

@app.route('/graphResult')
def graphResult():
    return render_template('graphResult.html')

@app.route('/signUp')
def signUp():
    return render_template('signUp.html', page="signUp")

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
    user = request.form['username']
    password = request.form['password']
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
        with dbconn.cursor() as cursor:
            queryCheckUserAvailability = "SELECT * from tbl_user where nama_user = %s"
            cursor.execute(queryCheckUserAvailability, (user,))
            data = cursor.fetchall()
            reg_user = True
            if len(data) is 0:
                query = "INSERT INTO `tbl_user` (`nama_user`, `password`) VALUES (%s, %s)"
                cursor.execute(query, (user, password))
                dbconn.commit()
                result = {'success': True, 'url': '/signIn', 'user': user, 'pass': password,
                          'message': 'Register Success'}
                return jsonify(result)
                # return json.dumps({'status': 'OK', 'user': user, 'pass': password})
            else:
                result = {'success': False, 'url': None, 'error': str(data[0]),
                          'message': 'Username is already taken, please choose another username'}
                return jsonify(result)
                # return json.dumps({'error': str(data[0]), 'message': 'Username is already taken, please choose another username'})
    except Exception as err:
        print(err)
    finally:
        dbconn.close()
        if reg_user == False:
            return "finish"

@app.route('/signIn')
def signIn():
    if session.get('logged_in'):
        return redirect(url_for('index'))
    else:
        return render_template('signIn.html', page="signIn")

@app.route('/signInUser', methods=['POST'])
def signInUser():
    user = request.form['username']
    password = request.form['password']
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
            query = "SELECT * from `tbl_user` where `nama_user` = %s AND `password` = %s"
            cursor.execute(query, (user, password))
            data = cursor.fetchone()
            login_user = True
            idUser = data['id_user']
            print(login_user)
            print(data)
            print(idUser)

            if len(data) is 0:
                flash('Username or Password is Wrong')
                result = {'success': False, 'url': None, 'message': 'Username or Password is Wrong'}
                return jsonify(result)
            else:
                curentTime = getCurrentTime()
                session['logged_in'] = True
                session['username'] = user
                session['id_user'] = idUser
                session['login_date'] = curentTime

                queryInsertSession = "INSERT INTO `tbl_session` (`id_user`, `usr_timestamp`) VALUES (%s, %s)"
                cursor.execute(queryInsertSession, (str(idUser), str(curentTime)))
                dbconn.commit()

                print(session.get('logged_in'))
                print(session.get('username'))
                print(session.get('id_user'))
                print(session.get('login_date'))

                id_user = session.get('id_user')
                user_time = session.get('login_date')
                queryGetSession = "SELECT * FROM `tbl_session` WHERE `id_user` = %s AND `usr_timestamp` = %s"
                cursor.execute(queryGetSession, (str(id_user), str(user_time)))
                dataSession = cursor.fetchone()

                if len(dataSession) is 0:
                    result = {'success': False, 'url': None, 'message': 'Data Session Kosong'}
                    return jsonify(result)
                else:
                    id_session = dataSession['id_session']
                    session['id_session'] = id_session
                    print(session.get('id_session'))
                    result = {'success': True, 'url': '/', 'id_user': idUser, 'login_date': curentTime, 'username': user, 'message': 'Login Success'}
                    return jsonify(result)
    except Exception as err:
        print(err)
        return "error"
    finally:
        dbconn.close()
        if login_user == False:
            result = {'success':False,'url':None}
            return jsonify(result)

def getCurrentTime():
    waktu = time.time()
    waktuSekarang = datetime.datetime.fromtimestamp(waktu).strftime('%Y-%m-%d %H:%M:%S')
    return waktuSekarang

@app.route('/signOut')
def signOut():
    session['logged_in'] = False
    return redirect(url_for('index'))
    # return index()

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