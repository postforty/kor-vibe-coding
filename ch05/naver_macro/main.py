import tkinter as tk
import time
import pyautogui
import keyboard
from server_time import get_naver_time_offset
from macro_core import MacroEngine

class MacroGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("네이버 서버 시간 매크로 (초고속)")
        self.root.geometry("400x380")
        # 윈도우가 항상 위에 있도록 설정
        self.root.attributes('-topmost', True)
        
        self.macro_engine = MacroEngine()
        self.time_offset = 0
        
        self.create_widgets()
        
        # 최초 1회 동기화 후 시간 표시 시작
        self.sync_server_time()
        self.update_time_display()
        
    def sync_server_time(self):
        self.status_label.config(text="서버 시간 동기화 중...")
        self.root.update()
        
        self.time_offset = get_naver_time_offset()
        self.macro_engine.set_time_offset(self.time_offset)
        
        if self.time_offset == 0:
            self.status_label.config(text="시간 동기화 실패 (오프라인이거나 오류 발생)", fg="red")
        else:
            self.status_label.config(text="서버 시간 동기화 완료!", fg="black")
            # 잠시 후 상태 메시지 리셋
            self.root.after(2000, lambda: self.status_label.config(text="대기 중", fg="gray"))
            
    def create_widgets(self):
        # 상단 서버 시간 표시부
        time_frame = tk.Frame(self.root, pady=10)
        time_frame.pack()
        
        tk.Label(time_frame, text="현재 네이버 서버 시간", font=("Arial", 10)).pack()
        self.time_label = tk.Label(time_frame, text="00:00:00.00", font=("Arial", 22, "bold"), fg="blue")
        self.time_label.pack()
        
        # 동기화 버튼
        tk.Button(time_frame, text="시간 재동기화", command=self.sync_server_time, font=("Arial", 8)).pack(pady=2)
        
        # 구분선
        tk.Frame(self.root, height=2, bd=1, relief=tk.SUNKEN).pack(fill=tk.X, padx=20, pady=5)
        
        # 목표 시간 입력부
        target_frame = tk.Frame(self.root, pady=10)
        target_frame.pack()
        
        tk.Label(target_frame, text="목표 시간 (HH:MM:SS):", font=("Arial", 10, "bold")).grid(row=0, column=0, padx=5)
        self.target_entry = tk.Entry(target_frame, width=12, font=("Arial", 12), justify='center')
        self.target_entry.grid(row=0, column=1)
        self.target_entry.insert(0, "12:00:00")
        
        # 좌표 설정부
        coord_frame = tk.Frame(self.root, pady=10)
        coord_frame.pack()
        
        self.coord_labels = []
        for i in range(3):
            btn = tk.Button(coord_frame, text=f"{i+1}번 좌표 설정", width=12, 
                            command=lambda idx=i: self.set_coordinate(idx))
            btn.grid(row=i, column=0, pady=3, padx=5)
            
            lbl = tk.Label(coord_frame, text="미설정", width=15, bg="lightgray")
            lbl.grid(row=i, column=1, pady=3)
            self.coord_labels.append(lbl)
            
        # 조작 버튼부
        action_frame = tk.Frame(self.root, pady=10)
        action_frame.pack()
        
        self.start_btn = tk.Button(action_frame, text="매크로 시작", bg="green", fg="white", 
                                   font=("Arial", 14, "bold"), width=15, command=self.start_macro)
        self.start_btn.pack()
        
        # 상태 메시지 표시부
        self.status_label = tk.Label(self.root, text="대기 중", fg="gray", font=("Arial", 10))
        self.status_label.pack(side=tk.BOTTOM, pady=10)
        
    def update_time_display(self):
        # 현재 시간에 offset을 더해 네이버 서버 시간을 계산
        current_server_time = time.time() + self.time_offset
        time_str = time.strftime("%H:%M:%S", time.localtime(current_server_time))
        # 소수점 이하(밀리초) 표시
        ms = int((current_server_time % 1) * 100)
        self.time_label.config(text=f"{time_str}.{ms:02d}")
        
        # 50ms 마다 갱신 (초당 20프레임 수준)
        self.root.after(50, self.update_time_display)
        
    def set_coordinate(self, index):
        self.status_label.config(text=f"마우스를 위치시키고 [Spacebar]를 누르세요.", fg="orange", font=("Arial", 10, "bold"))
        self.root.update()
        
        # keyboard 모듈을 사용하여 백그라운드 키 입력 대기 (after 이용)
        self._wait_for_space(index)
        
    def _wait_for_space(self, index):
        if keyboard.is_pressed('space'):
            x, y = pyautogui.position()
            self.macro_engine.set_coordinate(index, x, y)
            self.coord_labels[index].config(text=f"X:{x}, Y:{y}", bg="lightgreen")
            self.status_label.config(text=f"{index+1}번 좌표 설정 완료!", fg="black", font=("Arial", 10))
            # 키 중복 입력 방지
            time.sleep(0.3)
        else:
            self.root.after(50, lambda: self._wait_for_space(index))
            
    def update_status(self, message):
        """매크로 엔진에서 전달하는 콜백 메시지를 처리"""
        self.status_label.config(text=message, font=("Arial", 10, "bold"))
        if "오류" in message:
            self.status_label.config(fg="red")
            self.start_btn.config(state=tk.NORMAL)
        elif "취소됨" in message or "종료" in message:
            self.status_label.config(fg="orange")
            self.start_btn.config(state=tk.NORMAL)
        elif "완료" in message:
            self.status_label.config(fg="green")
            self.start_btn.config(state=tk.NORMAL)
        else:
            self.status_label.config(fg="blue")
            
    def start_macro(self):
        target_str = self.target_entry.get()
        self.macro_engine.set_target_time(target_str)
        # 중복 실행 방지를 위해 버튼 비활성화
        self.start_btn.config(state=tk.DISABLED)
        # 매크로 엔진 실행 (GUI를 멈추지 않게 백그라운드로 돎)
        self.macro_engine.start(self.update_status)
        
if __name__ == "__main__":
    root = tk.Tk()
    app = MacroGUI(root)
    root.mainloop()
