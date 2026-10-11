import pygame
import random
import sys

# ==========================================
# 게임 상수 설정
# ==========================================
CELL_SIZE = 30
GRID_WIDTH = 10
GRID_HEIGHT = 20

PLAY_WIDTH = GRID_WIDTH * CELL_SIZE
PLAY_HEIGHT = GRID_HEIGHT * CELL_SIZE

SIDEBAR_WIDTH = 220
WINDOW_WIDTH = PLAY_WIDTH + SIDEBAR_WIDTH + 60
WINDOW_HEIGHT = PLAY_HEIGHT + 60

TOP_LEFT_X = 30
TOP_LEFT_Y = 30

FPS = 60

# 색상 테마 (RGB)
BG_COLOR = (18, 18, 24)
GRID_BG_COLOR = (26, 26, 36)
GRID_LINE_COLOR = (38, 38, 52)
SIDEBAR_BG = (26, 26, 36)
TEXT_COLOR = (240, 240, 245)
SUB_TEXT_COLOR = (150, 150, 170)
HIGHLIGHT_COLOR = (255, 215, 0)
GHOST_ALPHA = 65

# 7종 테트로미노 색상
SHAPES_COLORS = {
    'I': (0, 240, 240),   # Cyan
    'O': (240, 240, 0),   # Yellow
    'T': (160, 0, 240),   # Purple
    'S': (0, 240, 0),     # Green
    'Z': (240, 0, 0),     # Red
    'J': (0, 100, 240),   # Blue
    'L': (240, 140, 0),   # Orange
}

# 7종 테트로미노 형태 정의 (4x4 or 3x3 회전 상태들)
SHAPES = {
    'I': [
        [(0, 1), (1, 1), (2, 1), (3, 1)],
        [(2, 0), (2, 1), (2, 2), (2, 3)],
        [(0, 2), (1, 2), (2, 2), (3, 2)],
        [(1, 0), (1, 1), (1, 2), (1, 3)]
    ],
    'O': [
        [(1, 0), (2, 0), (1, 1), (2, 1)]
    ],
    'T': [
        [(1, 0), (0, 1), (1, 1), (2, 1)],
        [(1, 0), (1, 1), (2, 1), (1, 2)],
        [(0, 1), (1, 1), (2, 1), (1, 2)],
        [(1, 0), (0, 1), (1, 1), (1, 2)]
    ],
    'S': [
        [(1, 0), (2, 0), (0, 1), (1, 1)],
        [(1, 0), (1, 1), (2, 1), (2, 2)],
        [(1, 1), (2, 1), (0, 2), (1, 2)],
        [(0, 0), (0, 1), (1, 1), (1, 2)]
    ],
    'Z': [
        [(0, 0), (1, 0), (1, 1), (2, 1)],
        [(2, 0), (1, 1), (2, 1), (1, 2)],
        [(0, 1), (1, 1), (1, 2), (2, 2)],
        [(1, 0), (0, 1), (1, 1), (0, 2)]
    ],
    'J': [
        [(0, 0), (0, 1), (1, 1), (2, 1)],
        [(1, 0), (2, 0), (1, 1), (1, 2)],
        [(0, 1), (1, 1), (2, 1), (2, 2)],
        [(1, 0), (1, 1), (0, 2), (1, 2)]
    ],
    'L': [
        [(2, 0), (0, 1), (1, 1), (2, 1)],
        [(1, 0), (1, 1), (1, 2), (2, 2)],
        [(0, 1), (1, 1), (2, 1), (0, 2)],
        [(0, 0), (1, 0), (1, 1), (1, 2)]
    ]
}


class Piece:
    def __init__(self, shape_name):
        self.shape_name = shape_name
        self.rotations = SHAPES[shape_name]
        self.rotation_idx = 0
        self.color = SHAPES_COLORS[shape_name]
        # 시작 위치: 상단 중앙
        self.x = GRID_WIDTH // 2 - 2
        self.y = 0

    @property
    def current_shape(self):
        return self.rotations[self.rotation_idx % len(self.rotations)]

    def get_cell_positions(self, offset_x=0, offset_y=0, rot_idx=None):
        if rot_idx is None:
            shape = self.current_shape
        else:
            shape = self.rotations[rot_idx % len(self.rotations)]
        
        positions = []
        for (bx, by) in shape:
            positions.append((self.x + bx + offset_x, self.y + by + offset_y))
        return positions


class TetrisGame:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Python Tetris")
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        self.clock = pygame.time.Clock()

        # 폰트 초기화 (한글/영문 기본 시스템 폰트 호환)
        self.font_large = pygame.font.SysFont("malgungothic,segoeui,arial", 32, bold=True)
        self.font_medium = pygame.font.SysFont("malgungothic,segoeui,arial", 20, bold=True)
        self.font_small = pygame.font.SysFont("malgungothic,segoeui,arial", 15)

        self.reset_game()

    def reset_game(self):
        self.grid = [[None for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.bag = []
        self.current_piece = self.get_random_piece()
        self.next_piece = self.get_random_piece()
        self.hold_piece = None
        self.can_hold = True
        
        self.score = 0
        self.lines_cleared = 0
        self.level = 1
        
        self.fall_time = 0
        self.game_over = False
        self.is_paused = False

    def get_random_piece(self):
        # 7-Bag 무작위 추출 알고리즘
        if not self.bag:
            self.bag = list(SHAPES.keys())
            random.shuffle(self.bag)
        return Piece(self.bag.pop())

    def is_valid_position(self, piece, offset_x=0, offset_y=0, rot_idx=None):
        for (x, y) in piece.get_cell_positions(offset_x, offset_y, rot_idx):
            if x < 0 or x >= GRID_WIDTH or y >= GRID_HEIGHT:
                return False
            if y >= 0 and self.grid[y][x] is not None:
                return False
        return True

    def lock_piece(self):
        for (x, y) in self.current_piece.get_cell_positions():
            if y < 0:
                self.game_over = True
                return
            self.grid[y][x] = self.current_piece.color

        self.clear_lines()
        self.current_piece = self.next_piece
        self.next_piece = self.get_random_piece()
        self.can_hold = True

        # 소환 위치에 이미 블록이 있다면 게임 오버
        if not self.is_valid_position(self.current_piece):
            self.game_over = True

    def clear_lines(self):
        new_grid = [row for row in self.grid if any(cell is None for cell in row)]
        cleared_count = GRID_HEIGHT - len(new_grid)

        if cleared_count > 0:
            for _ in range(cleared_count):
                new_grid.insert(0, [None for _ in range(GRID_WIDTH)])
            self.grid = new_grid
            
            # 표준 점수 계산법
            score_table = {1: 100, 2: 300, 3: 500, 4: 800}
            self.score += score_table.get(cleared_count, 100 * cleared_count) * self.level
            self.lines_cleared += cleared_count
            self.level = self.lines_cleared // 10 + 1

    def get_ghost_y_offset(self):
        offset_y = 0
        while self.is_valid_position(self.current_piece, offset_y=offset_y + 1):
            offset_y += 1
        return offset_y

    def hard_drop(self):
        offset_y = self.get_ghost_y_offset()
        self.current_piece.y += offset_y
        self.score += offset_y * 2
        self.lock_piece()

    def hold(self):
        if not self.can_hold:
            return
        
        current_name = self.current_piece.shape_name
        if self.hold_piece is None:
            self.hold_piece = Piece(current_name)
            self.current_piece = self.next_piece
            self.next_piece = self.get_random_piece()
        else:
            prev_hold_name = self.hold_piece.shape_name
            self.hold_piece = Piece(current_name)
            self.current_piece = Piece(prev_hold_name)
            
        self.can_hold = False

    def rotate_piece(self, clockwise=True):
        rotations_cnt = len(self.current_piece.rotations)
        if clockwise:
            new_rot = (self.current_piece.rotation_idx + 1) % rotations_cnt
        else:
            new_rot = (self.current_piece.rotation_idx - 1) % rotations_cnt

        # 기본 회전 및 월킥 (Wall Kick) 체크 (좌우 1칸, 2칸 밀어서 들어갈 수 있는지)
        for kick_x in [0, -1, 1, -2, 2]:
            if self.is_valid_position(self.current_piece, offset_x=kick_x, rot_idx=new_rot):
                self.current_piece.x += kick_x
                self.current_piece.rotation_idx = new_rot
                return

    def get_fall_speed(self):
        # 레벨이 올라갈수록 낙하 속도 증가 (최소 50ms)
        return max(50, int(1000 * (0.85 ** (self.level - 1))))

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE or event.key == pygame.K_p:
                    if not self.game_over:
                        self.is_paused = not self.is_paused

                if self.game_over:
                    if event.key == pygame.K_r:
                        self.reset_game()
                    continue

                if self.is_paused:
                    continue

                if event.key == pygame.K_LEFT:
                    if self.is_valid_position(self.current_piece, offset_x=-1):
                        self.current_piece.x -= 1
                elif event.key == pygame.K_RIGHT:
                    if self.is_valid_position(self.current_piece, offset_x=1):
                        self.current_piece.x += 1
                elif event.key == pygame.K_DOWN:
                    if self.is_valid_position(self.current_piece, offset_y=1):
                        self.current_piece.y += 1
                        self.score += 1
                elif event.key == pygame.K_UP:
                    self.rotate_piece(clockwise=True)
                elif event.key == pygame.K_z:
                    self.rotate_piece(clockwise=False)
                elif event.key == pygame.K_SPACE:
                    self.hard_drop()
                elif event.key == pygame.K_c or event.key == pygame.K_LSHIFT:
                    self.hold()

        return True

    def update(self, delta_time):
        if self.game_over or self.is_paused:
            return

        self.fall_time += delta_time
        speed = self.get_fall_speed()

        if self.fall_time >= speed:
            self.fall_time = 0
            if self.is_valid_position(self.current_piece, offset_y=1):
                self.current_piece.y += 1
            else:
                self.lock_piece()

    def draw_block(self, surface, x, y, color, alpha=255, is_ghost=False):
        rect = pygame.Rect(x, y, CELL_SIZE, CELL_SIZE)
        if is_ghost:
            ghost_surf = pygame.Surface((CELL_SIZE, CELL_SIZE), pygame.SRCALPHA)
            pygame.draw.rect(ghost_surf, (*color, GHOST_ALPHA), (1, 1, CELL_SIZE - 2, CELL_SIZE - 2), border_radius=4)
            pygame.draw.rect(ghost_surf, (*color, 120), (0, 0, CELL_SIZE, CELL_SIZE), width=1, border_radius=4)
            surface.blit(ghost_surf, (x, y))
        else:
            # 블록 본체 & 입체적인 하이라이트/그림자 효과
            pygame.draw.rect(surface, color, rect, border_radius=4)
            
            # 상단/좌측 하이라이트
            bright_color = tuple(min(255, c + 50) for c in color)
            pygame.draw.line(surface, bright_color, (x + 2, y + 2), (x + CELL_SIZE - 3, y + 2), 2)
            pygame.draw.line(surface, bright_color, (x + 2, y + 2), (x + 2, y + CELL_SIZE - 3), 2)
            
            # 하단/우측 셰도우
            dark_color = tuple(max(0, c - 60) for c in color)
            pygame.draw.line(surface, dark_color, (x + 2, y + CELL_SIZE - 2), (x + CELL_SIZE - 2, y + CELL_SIZE - 2), 2)
            pygame.draw.line(surface, dark_color, (x + CELL_SIZE - 2, y + 2), (x + CELL_SIZE - 2, y + CELL_SIZE - 2), 2)

    def draw_preview_piece(self, piece, start_x, start_y):
        if piece is None:
            return
        shape = piece.rotations[0]
        # 중심 정렬을 위한 offset 계산
        min_x = min(bx for bx, by in shape)
        max_x = max(bx for bx, by in shape)
        min_y = min(by for bx, by in shape)
        max_y = max(by for bx, by in shape)
        
        piece_w = (max_x - min_x + 1) * 22
        piece_h = (max_y - min_y + 1) * 22
        
        draw_x = start_x + (100 - piece_w) // 2 - min_x * 22
        draw_y = start_y + (80 - piece_h) // 2 - min_y * 22

        for (bx, by) in shape:
            rx = draw_x + bx * 22
            ry = draw_y + by * 22
            rect = pygame.Rect(rx, ry, 20, 20)
            pygame.draw.rect(self.screen, piece.color, rect, border_radius=3)

    def draw(self):
        self.screen.fill(BG_COLOR)

        # 1. 게임 보드 영역 배경
        board_rect = pygame.Rect(TOP_LEFT_X, TOP_LEFT_Y, PLAY_WIDTH, PLAY_HEIGHT)
        pygame.draw.rect(self.screen, GRID_BG_COLOR, board_rect, border_radius=6)

        # 격자선 그리기
        for col in range(GRID_WIDTH + 1):
            x = TOP_LEFT_X + col * CELL_SIZE
            pygame.draw.line(self.screen, GRID_LINE_COLOR, (x, TOP_LEFT_Y), (x, TOP_LEFT_Y + PLAY_HEIGHT))
        for row in range(GRID_HEIGHT + 1):
            y = TOP_LEFT_Y + row * CELL_SIZE
            pygame.draw.line(self.screen, GRID_LINE_COLOR, (TOP_LEFT_X, y), (TOP_LEFT_X + PLAY_WIDTH, y))

        # 고정된 블록 렌더링
        for row in range(GRID_HEIGHT):
            for col in range(GRID_WIDTH):
                color = self.grid[row][col]
                if color:
                    px = TOP_LEFT_X + col * CELL_SIZE
                    py = TOP_LEFT_Y + row * CELL_SIZE
                    self.draw_block(self.screen, px, py, color)

        # 활성 블록 및 고스트 피스 렌더링
        if not self.game_over and self.current_piece:
            ghost_offset_y = self.get_ghost_y_offset()
            # 고스트 피스
            for (x, y) in self.current_piece.get_cell_positions(offset_y=ghost_offset_y):
                if y >= 0:
                    px = TOP_LEFT_X + x * CELL_SIZE
                    py = TOP_LEFT_Y + y * CELL_SIZE
                    self.draw_block(self.screen, px, py, self.current_piece.color, is_ghost=True)

            # 현재 블록
            for (x, y) in self.current_piece.get_cell_positions():
                if y >= 0:
                    px = TOP_LEFT_X + x * CELL_SIZE
                    py = TOP_LEFT_Y + y * CELL_SIZE
                    self.draw_block(self.screen, px, py, self.current_piece.color)

        # 게임 보드 외곽 테두리
        pygame.draw.rect(self.screen, (70, 70, 95), board_rect, width=2, border_radius=6)

        # 2. 우측 사이드바 UI 렌더링
        sidebar_x = TOP_LEFT_X + PLAY_WIDTH + 25
        sidebar_y = TOP_LEFT_Y

        # NEXT 블록 패널
        next_rect = pygame.Rect(sidebar_x, sidebar_y, 190, 110)
        pygame.draw.rect(self.screen, SIDEBAR_BG, next_rect, border_radius=8)
        pygame.draw.rect(self.screen, (50, 50, 70), next_rect, width=1, border_radius=8)
        
        lbl_next = self.font_medium.render("NEXT", True, HIGHLIGHT_COLOR)
        self.screen.blit(lbl_next, (sidebar_x + 15, sidebar_y + 10))
        self.draw_preview_piece(self.next_piece, sidebar_x + 45, sidebar_y + 35)

        # HOLD 블록 패널
        hold_y = sidebar_y + 125
        hold_rect = pygame.Rect(sidebar_x, hold_y, 190, 110)
        pygame.draw.rect(self.screen, SIDEBAR_BG, hold_rect, border_radius=8)
        pygame.draw.rect(self.screen, (50, 50, 70), hold_rect, width=1, border_radius=8)
        
        lbl_hold = self.font_medium.render("HOLD (C)", True, HIGHLIGHT_COLOR)
        self.screen.blit(lbl_hold, (sidebar_x + 15, hold_y + 10))
        self.draw_preview_piece(self.hold_piece, sidebar_x + 45, hold_y + 35)

        # SCORE / LEVEL / LINES 패널
        stat_y = hold_y + 125
        stat_rect = pygame.Rect(sidebar_x, stat_y, 190, 180)
        pygame.draw.rect(self.screen, SIDEBAR_BG, stat_rect, border_radius=8)
        pygame.draw.rect(self.screen, (50, 50, 70), stat_rect, width=1, border_radius=8)

        stats = [
            ("SCORE", str(self.score)),
            ("LEVEL", str(self.level)),
            ("LINES", str(self.lines_cleared))
        ]

        for i, (title, val) in enumerate(stats):
            ty = stat_y + 15 + i * 52
            t_surf = self.font_small.render(title, True, SUB_TEXT_COLOR)
            v_surf = self.font_medium.render(val, True, TEXT_COLOR)
            self.screen.blit(t_surf, (sidebar_x + 15, ty))
            self.screen.blit(v_surf, (sidebar_x + 15, ty + 18))

        # 하단 조작 가이드 패널
        guide_y = stat_y + 195
        guide_rect = pygame.Rect(sidebar_x, guide_y, 190, 140)
        pygame.draw.rect(self.screen, (20, 20, 28), guide_rect, border_radius=8)
        pygame.draw.rect(self.screen, (40, 40, 55), guide_rect, width=1, border_radius=8)

        guides = [
            ("↑ / Z", "회전"),
            ("← →", "이동"),
            ("↓ / SPACE", "소프트 / 하드드롭"),
            ("C / Shift", "홀드"),
            ("P / ESC", "일시정지")
        ]
        for idx, (key, desc) in enumerate(guides):
            gy = guide_y + 10 + idx * 24
            k_surf = self.font_small.render(key, True, HIGHLIGHT_COLOR)
            d_surf = self.font_small.render(desc, True, SUB_TEXT_COLOR)
            self.screen.blit(k_surf, (sidebar_x + 10, gy))
            self.screen.blit(d_surf, (sidebar_x + 100, gy))

        # 게임 오버 오버레이
        if self.game_over:
            overlay = pygame.Surface((PLAY_WIDTH, PLAY_HEIGHT), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 190))
            self.screen.blit(overlay, (TOP_LEFT_X, TOP_LEFT_Y))

            go_surf = self.font_large.render("GAME OVER", True, (255, 70, 70))
            r_surf = self.font_medium.render("Press 'R' to Restart", True, TEXT_COLOR)
            
            self.screen.blit(go_surf, (TOP_LEFT_X + (PLAY_WIDTH - go_surf.get_width()) // 2, TOP_LEFT_Y + 230))
            self.screen.blit(r_surf, (TOP_LEFT_X + (PLAY_WIDTH - r_surf.get_width()) // 2, TOP_LEFT_Y + 280))

        # 일시정지 오버레이
        elif self.is_paused:
            overlay = pygame.Surface((PLAY_WIDTH, PLAY_HEIGHT), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 160))
            self.screen.blit(overlay, (TOP_LEFT_X, TOP_LEFT_Y))

            pause_surf = self.font_large.render("PAUSED", True, HIGHLIGHT_COLOR)
            self.screen.blit(pause_surf, (TOP_LEFT_X + (PLAY_WIDTH - pause_surf.get_width()) // 2, TOP_LEFT_Y + 260))

        pygame.display.flip()

    def run(self):
        running = True
        while running:
            delta_time = self.clock.tick(FPS)
            running = self.handle_events()
            self.update(delta_time)
            self.draw()

        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    game = TetrisGame()
    game.run()
