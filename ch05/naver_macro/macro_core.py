import time
import pyautogui
import keyboard
import threading
from datetime import datetime

class MacroEngine:
    def __init__(self):
        self.is_running = False
        self.coords = [(None, None), (None, None), (None, None)]
        self.target_time_str = ""
        self.time_offset = 0
        self.thread = None
        
    def set_coordinate(self, index, x, y):
        if 0 <= index < 3:
            self.coords[index] = (x, y)
            
    def set_target_time(self, target_time_str):
        self.target_time_str = target_time_str
        
    def set_time_offset(self, offset):
        self.time_offset = offset

    def start(self, callback_message):
        if self.is_running:
            return
            
        # 설정 유효성 검사
        for i, coord in enumerate(self.coords):
            if coord[0] is None or coord[1] is None:
                callback_message(f"오류: 좌표 {i+1}이(가) 설정되지 않았습니다.")
                return
                
        if not self.target_time_str:
            callback_message("오류: 목표 시간을 설정해주세요. (HH:MM:SS)")
            return
            
        self.is_running = True
        
        # 백그라운드 스레드에서 대기 루프 실행 (GUI 멈춤 방지)
        self.thread = threading.Thread(target=self._run_loop, args=(callback_message,))
        self.thread.daemon = True
        self.thread.start()
        
    def stop(self):
        self.is_running = False

    def _run_loop(self, callback_message):
        callback_message("매크로 대기 중... (ESC 키를 누르면 취소됩니다)")
        
        # 입력된 목표 시간을 오늘 날짜 기준으로 변환
        now = datetime.now()
        try:
            target_time_obj = datetime.strptime(self.target_time_str, "%H:%M:%S")
            target_dt = now.replace(hour=target_time_obj.hour, minute=target_time_obj.minute, 
                                    second=target_time_obj.second, microsecond=0)
            
            target_timestamp = target_dt.timestamp()
            
            # 만약 목표 시간이 이미 지났다면 다음날로 설정
            if target_timestamp < time.time() + self.time_offset:
                 callback_message("오류: 이미 지나간 시간입니다.")
                 self.is_running = False
                 return
                 
        except ValueError:
            callback_message("오류: 시간 형식이 잘못되었습니다. (HH:MM:SS)")
            self.is_running = False
            return
            
        # 초고속 연속 클릭을 위해 PAUSE를 0으로 설정
        pyautogui.PAUSE = 0
            
        while self.is_running:
            # ESC 키 긴급 종료 기능
            if keyboard.is_pressed('esc'):
                callback_message("취소됨: ESC 키가 눌려 매크로가 종료되었습니다.")
                self.is_running = False
                break
                
            current_local_timestamp = time.time()
            current_server_timestamp = current_local_timestamp + self.time_offset
            
            time_left = target_timestamp - current_server_timestamp
            
            if time_left <= 0:
                # 목표 시간 도달! 시스템이 허용하는 한 가장 빠르게 좌표 3개 클릭
                for x, y in self.coords:
                    pyautogui.click(x=x, y=y)
                    
                callback_message("클릭 완료!")
                self.is_running = False
                break
            
            # 남은 시간에 따라 대기 간격 조정 (CPU 리소스 최적화 및 정밀도 향상)
            if time_left > 1:
                # 1초 이상 남았을 때는 CPU를 덜 쓰도록 Sleep
                time.sleep(0.1)
            elif time_left > 0.05:
                # 0.05초~1초 남았을 때는 짧게 Sleep
                time.sleep(0.01)
            else:
                # 0.05초 미만일 때는 Sleep 없이 While 루프 최대로 돌려 오차 최소화
                pass 
