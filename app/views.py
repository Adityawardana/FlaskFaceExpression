from flask import Flask, render_template, Response, request, url_for, flash, redirect, json, session, jsonify
from decimal import Decimal
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired
from urllib.parse import quote

import json
import datetime
import time
import base64
import random
import pymysql

from app import app

@app.route('/<imageUrl>', methods=['GET','POST'])
def index(imageUrl):
    imageUrl = quote(imageUrl, safe="")
    if imageUrl != "%F0%9F%8E%B5":     
        return redirect("%F0%9F%8E%B5", code=302)   
    else:
        if not session.get('logged_in'):
            return render_template("index.html", title="Home")
        else:
            return render_template("index_home.html", title="Index Home")

@app.route('/')
def redirectHome():
    return redirect("%F0%9F%8E%B5", code=302)
    

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
        # return redirect(url_for('index'))
        return redirect("%F0%9F%8E%B5", code=302)
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
                tokEncd = getKeyToken(user)
                session['logged_in'] = True
                session['username'] = user
                session['id_user'] = idUser
                session['login_date'] = curentTime
                session['token'] = tokEncd

                queryInsertSession = "INSERT INTO `tbl_session` (`id_user`, `usr_timestamp`, `token`) VALUES (%s, %s, %s)"
                cursor.execute(queryInsertSession, (str(idUser), str(curentTime), str(tokEncd)))
                dbconn.commit()

                print('tokEncd = {}'.format(session.get('token')))
                print('logged_in = {}'.format(session.get('logged_in')))
                print('username = {}'.format(session.get('username')))
                print('id_user = {}'.format(session.get('id_user')))
                print('login_date = {}'.format(session.get('login_date')))

                id_user = session.get('id_user')
                user_time = session.get('login_date')
                tokEncode = session.get('token')
                queryGetSession = "SELECT * FROM `tbl_session` WHERE `id_user` = %s AND `usr_timestamp` = %s AND `token` = %s "
                cursor.execute(queryGetSession, (str(id_user), str(user_time), str(tokEncode)))
                dataSession = cursor.fetchone()

                if len(dataSession) is 0:
                    result = {'success': False, 'url': None, 'message': 'Data Session Kosong'}
                    return jsonify(result)
                else:
                    id_session = dataSession['id_session']
                    session['id_session'] = id_session
                    print(session.get('id_session'))
                    result = {'success': True, 'url': '/', 'id_user': idUser, 'login_date': curentTime, 'token': str(tokEncode),'username': user, 'message': 'Login Success'}
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
    # return redirect(url_for('index'))
    return redirect("%F0%9F%8E%B5", code=302)
    
@app.route('/face_detection_music')
def face_detection():
    if session.get('logged_in'):
        dbconn = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            db='ffe',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        fd = False
        try:
            if session.get('token'):
                session.pop('token', None)
                session.pop('login_date', None)
                session.pop('id_session', None)

                userName = session.get('username')
                idUser = session.get('id_user')
                                
                curentTime = getCurrentTime()
                tokEncd = getKeyToken(userName)
                                
                session['token'] = tokEncd
                session['login_date'] = curentTime                                        

                with dbconn.cursor() as cursor:
                    queryInsertSession = "INSERT INTO `tbl_session` (`id_user`, `usr_timestamp`, `token`) VALUES (%s, %s, %s)"
                    cursor.execute(queryInsertSession, (str(idUser), str(curentTime), str(tokEncd)))
                    dbconn.commit()
                    fd = True

                    print('tokEncd = {}'.format(session.get('token')))
                    print('logged_in = {}'.format(session.get('logged_in')))
                    print('username = {}'.format(session.get('username')))
                    print('id_user = {}'.format(session.get('id_user')))
                    print('login_date = {}'.format(session.get('login_date')))

                    id_user = session.get('id_user')
                    user_time = session.get('login_date')
                    tokEncode = session.get('token')
                    queryGetSession = "SELECT * FROM `tbl_session` WHERE `id_user` = %s AND `usr_timestamp` = %s AND `token` = %s "
                    cursor.execute(queryGetSession, (str(id_user), str(user_time), str(tokEncode)))
                    dataSession = cursor.fetchone()

                    if len(dataSession) is 0:
                        result = {'success': False, 'url': None, 'message': 'Data Session Kosong'}
                        return jsonify(result)
                    else:
                        id_session = dataSession['id_session']
                        session['id_session'] = id_session
                        print(session.get('id_session'))
                        print("Success")
                        return render_template("face_detection_music.html", title="Face Detection Music")
        except Exception as err:
            print(err)
            return "error"
        finally:
            dbconn.close()
            if fd == False:
                return "False"
    else:
        # return redirect(url_for('index'))
        return redirect("%F0%9F%8E%B5", code=302)

def getKeyToken(uName):
    listStr = ["abcdef","ghijkl","mnopqr","stuvwx","yzABCD","EFGHIJ","KLMNOP","QRSTUV","WXYZab"]
    strEnc = random.choice(listStr)
    randInt = random.randint(1,101)
    randNum = str(randInt)
    user = uName
    strTok = strEnc + randNum + user
    tokEnc = base64.b64encode(strTok.encode('utf-8',errors = 'strict'))

    print(randInt)
    print(strEnc)
    print(strTok)
    # print(tokEnc)
    print ("Encoded String: " , tokEnc)

    return tokEnc

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
            sp = data.get('songplaylist')
            ks = data.get('kategorisong')

            spStr = str(sp)
            ksStr = str(ks)
            tsStr = str(ts)
            moStr = str(mo)
            print('ts = {}, mo = {}, sp = {}, ks = {}'.format(tsStr, moStr, spStr, ksStr))
            with dbconn.cursor() as cursor:
                query = "INSERT INTO `tbl_mo` (`id_session`, `ts`, `mo`, `song_list`, `song_kategori`) VALUES (%s, %s, %s, %s, %s)"
                # query = "INSERT INTO `tbl_mo` (`id_mo`, `id_session`, `ts`, `mo`) VALUES (NULL, '"+idSession+"', '"+tsStr+"', '"+moStr+"')"
                cursor.execute(query, (str(idSession), tsStr, moStr, spStr, ksStr))
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
            userName = session.get('username')
            print(userName)
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
                result = {'success': True, 'url': '/graphResult', 'message': 'Success', 'dataInterestValue': data, 'username':userName, 'idSession':idSession}
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

@app.route('/countAllInterest', methods=['POST'])
def countAllInterest():
    sessionId = int(request.form['sessionId'])
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    checkAllCountInterest = False
    try:
        with dbconn.cursor() as cursor:
            userName = session.get('username')
            print(userName)
            print(sessionId)
            type(sessionId)
            query = "SELECT * FROM `tbl_mo` WHERE `id_session` = %s ORDER BY `ts` ASC"
            cursor.execute(query, (sessionId,))
            data = cursor.fetchall()
            print(data)
            checkAllCountInterest = True
            print(checkAllCountInterest)

            if len(data) is 0:
                result = {'success': False, 'url': None, 'message': 'Data Tabel mo Kosong'}
                return jsonify(result)
            else:
                result = {'success': True, 'url': '/allGraph', 'message': 'Success', 'dataInterestValue': data, 'username':userName, 'idSession':sessionId}
                # 'id_session': data["id_session"], 'time': data["ts"],
                #                           'mo': data["mo"],
                return jsonify(result)
            # return render_template('graphResult.html', listTs = listTs, listMo = listMo)
    except Exception as err:
        print(err)
        return "error"
    finally:
        dbconn.close()
        if checkAllCountInterest == False:
            return "false"

@app.route('/graphResult')
def graphResult():
    return render_template('graphResult.html')

@app.route('/allGraph')
def allGraph():
    id_user = session.get('id_user')
    dbconn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ffe',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    checkAllGraph = False
    try:
        with dbconn.cursor() as cursor:
            print(id_user)
            type(id_user)
            query = "SELECT DISTINCT s.id_session FROM tbl_session s INNER JOIN tbl_mo m ON s.id_session = m.id_session AND s.id_user = %s"
            cursor.execute(query, (id_user,))
            data = cursor.fetchall()
            print(data)
            checkAllGraph = True
            print(checkAllGraph)

            if len(data) is 0:
                return render_template('allGraph_empty.html')
                # result = {'success': False, 'url': None, 'message': 'Data Session User Kosong'}
                # return jsonify(result)
            else:
                return render_template('allGraph.html', dataSession = data)
    except Exception as err:
        print(err)
        return "error"
    finally:
        dbconn.close()
        if checkAllGraph == False:
            return "false"