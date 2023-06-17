'''
Author: xuran
LastEditTime: 2023-04-03 15:57:44
Description: file content
'''


import sys
import io
import os
from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QApplication,QMainWindow,QFileDialog,QWidget
from PyQt5.QtCore import *
from PyQt5.Qt import *

import keyboard
from enum import Enum

# 注册快捷键标识
class Key_e(Enum):
    save=1



class TEdit(QtWidgets.QTextEdit):
    def __init__(self) -> None:
        super().__init__()
    
        

class Ui_MainWindow(QWidget):
    def __init__(self,MainWindow,app) -> None:
        super().__init__()
        self.MainWindow=MainWindow
        self.app=app
        self.file_path=""
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("记事本")
        MainWindow.resize(800, 600)
        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 26))
        self.menu_F = QtWidgets.QMenu(self.menubar)
        self.menu_F.setObjectName("menu_F")
        self.menu_E = QtWidgets.QMenu(self.menubar)
        self.menu_E.setObjectName("menu_F")
        self.menu_G = QtWidgets.QMenu(self.menubar)
        self.menu_G.setObjectName("menu_G")
        self.menubar.setObjectName("menubar")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)
        
        self.input=TEdit()
        self.input.setGeometry(QtCore.QRect(800, 0, 200, 200))
        self.input.grabKeyboard()
        MainWindow.setCentralWidget(self.input)

        
        self.actionNew = QtWidgets.QAction(MainWindow)
        self.actionNew.setObjectName("actionNew")
        self.actionOpen = QtWidgets.QAction(MainWindow)
        self.actionOpen.setObjectName("actionOpen")
        self.actionClose = QtWidgets.QAction(MainWindow)
        self.actionClose.setObjectName("actionClose")
        self.actionSave = QtWidgets.QAction(MainWindow)
        self.actionSave.setObjectName("actionSave")
        
        self.actionCopy = QtWidgets.QAction(MainWindow)
        self.actionCopy.setObjectName("actionNew")
        self.actionPaste = QtWidgets.QAction(MainWindow)
        self.actionPaste.setObjectName("actionOpen")
        self.actionCut = QtWidgets.QAction(MainWindow)
        self.actionCut.setObjectName("actionClose")
        
        # 帮助
        self.actionHelp = QtWidgets.QAction(MainWindow)
        self.actionHelp.setObjectName("actionHelp")
        
        self.menu_F.addAction(self.actionNew)
        self.menu_F.addAction(self.actionOpen)
        self.menu_F.addAction(self.actionSave)
        self.menu_F.addAction(self.actionClose)
        
        
        self.menu_E.addAction(self.actionCopy)
        self.menu_E.addAction(self.actionPaste)
        self.menu_E.addAction(self.actionCut)
        
        
        self.menu_G.addAction(self.actionHelp)
        
        
        self.menubar.addAction(self.menu_F.menuAction())
        self.menubar.addAction(self.menu_E.menuAction())
        self.menubar.addAction(self.menu_G.menuAction())
        
        self.actionOpen.triggered.connect(self.openMsg)
        self.actionSave.triggered.connect(self.save_win)
        self.actionClose.triggered.connect(self.close_win)
        
        self.actionHelp.triggered.connect(self.closeEvent)
        
        keyboard.add_hotkey('ctrl+s',self.save_file,trigger_on_release=True)
        
        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)
        
    
    def openMsg(self):
        list1=[".txt",".json"]
        file,ok = QFileDialog.getOpenFileName(self.MainWindow,"打开","D:/","*.txt")
        if ok:
            for i in list1:
                if file.endswith(i)!=-1:
                    self.file_path=file
                    with open(file,"r",encoding="utf-8") as afile:
                        self.input.setText(afile.read())
                        afile.close()
        
                    
    def close_win(self):
        self.app.instance().quit()
    
    def save_win(self):
        if self.file_path=="" or os.path.isfile(self.file_path)==False:
            # 另存为
            file_p,ok=QFileDialog.getSaveFileName(self.MainWindow,"另存为","C:/","*.*")
            if ok:
                with open(file_p,"w+",encoding="utf-8") as file_obj_t:
                    file_obj_t.write(self.input.toPlainText())
                    file_obj_t.close()
                    print("保存成功")
        elif self.file_path!="" and len(self.file_path)!=0:
            with open(self.file_path,"w+",encoding="utf-8") as file_a:
                file_a.write(self.input.toPlainText())
                file_a.close()
                print("保存成功")
    # 添加中文的确认退出提示框1
    def closeEvent(self, event):
        # 创建一个消息盒子（提示框）
        Msgabout = QtWidgets.QMessageBox.about(self, '关于', '本软件由徐然开发于2023.4.3，联系方式(QQ):1783558957')
        
    
    def save_file(self):
        if self.file_path=="" or os.path.isfile(self.file_path)==False:
            # 另存为
            file_p1,ok=QFileDialog.getSaveFileName(self.MainWindow,"另存为","C:/","*.*")
            if ok:
                with open(file_p1,"w+",encoding="utf-8") as file_obj_t:
                    file_obj_t.write(self.input.toPlainText())
                    file_obj_t.close()
                    print("保存成功")
        elif self.file_path!="" and len(self.file_path)!=0:
            with open(self.file_path,"w+",encoding="utf-8") as file_a:
                file_a.write(self.input.toPlainText())
                file_a.close()
                print("保存成功")
        
    
    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "记事本"))
        self.menu_F.setTitle(_translate("MainWindow", "文件(&F)"))
        self.menu_E.setTitle(_translate("MainWindow", "编辑(&E)"))
        self.menu_G.setTitle(_translate("MainWindow", "帮助(&H)"))
        self.actionNew.setText(_translate("MainWindow", "新建"))
        self.actionNew.setShortcut(_translate("MainWindow", "Ctrl+n"))
        self.actionOpen.setText(_translate("MainWindow", "打开"))
        self.actionOpen.setShortcut(_translate("MainWindow", "Ctrl+O"))
        self.actionSave.setText(_translate("MainWindow", "保存"))
        self.actionSave.setShortcut(_translate("MainWindow", "Ctrl+S"))
        self.actionClose.setText(_translate("MainWindow", "关闭"))
        self.actionClose.setShortcut(_translate("MainWindow", "Ctrl+w"))
        self.actionCopy.setText(_translate("MainWindow", "复制"))
        self.actionCopy.setShortcut(_translate("MainWindow", "Ctrl+c"))
        self.actionPaste.setText(_translate("MainWindow", "粘贴"))
        self.actionPaste.setShortcut(_translate("MainWindow", "Ctrl+v"))
        self.actionCut.setText(_translate("MainWindow", "剪切"))
        self.actionCut.setShortcut(_translate("MainWindow", "Ctrl+x"))
        self.actionHelp.setText(_translate("MainWindow", "关于"))
        # self.actionHelp.setShortcut(_translate("MainWindow", "F1"))
        

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow(MainWindow,app)
    ui.setupUi(MainWindow)
    
    MainWindow.show()
    sys.exit(app.exec_())






