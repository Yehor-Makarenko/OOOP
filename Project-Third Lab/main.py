import math
import random
import pygame
import time


def addBall(balls, x, y, xs, ys, s, r, g, b):
    balls.append({
        "x": x,
        "y": y,
        "xs": xs,
        "ys": ys,
        "size": s,
        "r": r,
        "g": g,
        "b": b
    })


def addPlatform(platform, x1, y1, x2, y2):
    dx, dy, dist = getV(x1, y1, x2, y2)
    dx, dy = normalise(dx, dy, dist)
    platform.append({
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
        "tx": dx,
        "ty": dy,
        "nx": (0 - dy),
        "ny": dx,
        "length": dist
    })


def init(balls, platform):
    balls = []
    platform = []


def getV(x1, y1, x2, y2):
    dx = (x2 - x1)
    dy = (y2 - y1)
    dist = ((dx * dx) + (dy * dy))
    dist = math.sqrt(dist)
    return (dx, dy, dist)


def normalise(dx, dy, dist):
    if not (dist == 0):
        dx2 = (dx / dist)
        dy2 = (dy / dist)
        return (dx2, dy2)


def ballchange(balls, index, i2, val):
    balls[index][i2] = (balls[index][i2] + val)


def deleteball(balls, index):
    balls.pop(index)


def checkBC(balls, bi1, bi2, bounce):
    dx, dy, dist = getV(balls[bi1]["x"], balls[bi1]["y"], balls[bi2]["x"],
                        balls[bi2]["y"])
    depth = ((balls[bi1]["size"] + balls[bi2]["size"]) - dist)
    if depth > 0:
        dx, dy = normalise(dx, dy, dist)
        depth = depth / 2
        ballchange(balls, bi1, "x", (dx * (0 - depth)))
        ballchange(balls, bi1, "y", (dy * (0 - depth)))
        ballchange(balls, bi2, "x", (dx * depth))
        ballchange(balls, bi2, "y", (dy * depth))
        rvx = (balls[bi2]["xs"] - balls[bi1]["xs"])
        rvy = (balls[bi2]["ys"] - balls[bi1]["ys"])
        rv = (dx * rvx) + (dy * rvy)
        rv = (-1 - bounce) * (rv / 2)
        ballchange(balls, bi1, "xs", (dx * (0 - rv)))
        ballchange(balls, bi1, "ys", (dy * (0 - rv)))
        ballchange(balls, bi2, "xs", (dx * (rv)))
        ballchange(balls, bi2, "ys", (dy * (rv)))


def colBall(balls, index, pos, pRad, bounce):
    dx, dy, dist = getV(pos[0], pos[1], balls[index]["x"], balls[index]["y"])
    depth = ((pRad + balls[index]["size"]) - dist)
    if depth > 0:
        dx, dy = normalise(dx, dy, dist)
        if dy < 0:
            depth = (depth + 0.1)
        ballchange(balls, index, "x", (dx * depth))
        ballchange(balls, index, "y", (dy * depth))
        velop = ((dx * balls[index]["xs"]) + (dy * balls[index]["ys"]))
        velop = ((0 - bounce) * velop)
        ballchange(balls, index, "xs", (dx * velop))
        ballchange(balls, index, "ys", (dy * velop))


def checkcol(balls, platform, bi, pi, pRad, bounce):
    dx, dy, dist = getV(platform[pi]["x1"], platform[pi]["y1"], balls[bi]["x"],
                        balls[bi]["y"])
    tp = ((dx * platform[pi]["tx"]) + (dy * platform[pi]["ty"]))
    if tp < 0:
        tp = 0
    if tp > platform[pi]["length"]:
        tp = platform[pi]["length"]
    colBall(balls, bi, [(platform[pi]["x1"] + (tp * platform[pi]["tx"])),
                        (platform[pi]["y1"] + (tp * platform[pi]["ty"]))],
            pRad, bounce)


def update(balls, platform, pRad, bounce, gravity, friction, bbounce, w, h):
    bi = 0
    for bi in range(len(balls)):
        if bi < len(balls):
            ballchange(balls, bi, "x", balls[bi]["xs"])
            ballchange(balls, bi, "y", balls[bi]["ys"])
            ballchange(balls, bi, "xs", 0)
            ballchange(balls, bi, "ys", gravity)
            balls[bi]["xs"] = balls[bi]["xs"] * friction
            for ob in range(len(balls)):
                if not (bi == ob):
                    checkBC(balls, bi, ob, bbounce)
            pi = 0
            for pi in range(len(platform)):
                checkcol(balls, platform, bi, pi, pRad, bounce)
            if balls[bi]["x"] > w:
                deleteball(balls, bi)
            elif balls[bi]["y"] > h:
                deleteball(balls, bi)


def anToXY(angle, rad, x, y):
    x = x + (rad * (math.cos(angle)))
    y = y + (rad * (math.sin(angle)))
    return (x, y)


def drawLine(x1, y1, x2, y2, size, col):
    pygame.draw.line(win, (0, 0, 0), [x1, y1], [x2, y2], size + 1)
    pygame.draw.circle(win, col, (x1, y1), size, size)
    pygame.draw.circle(win, col, (x2, y2), size, size)


def render(balls, platform, win, pCol, pRad):
    pi = 0
    for pi in range(len(platform)):
        pygame.draw.line(win, pCol, [platform[pi]["x1"], platform[pi]["y1"]],
                         [platform[pi]["x2"], platform[pi]["y2"]], (pRad * 2))
        pygame.draw.circle(win, pCol,
                           (int(platform[pi]["x1"]), int(platform[pi]["y1"])),
                           pRad, pRad - 1)
        pygame.draw.circle(win, pCol,
                           (int(platform[pi]["x2"]), int(platform[pi]["y2"])),
                           pRad, pRad - 1)

    pi = 0
    for pi in range(len(balls)):
        pygame.draw.circle(win,
                           (balls[pi]["r"], balls[pi]["g"], balls[pi]["b"]),
                           (int(balls[pi]["x"]), int(balls[pi]["y"])),
                           balls[pi]["size"], balls[pi]["size"])
        pygame.draw.circle(win, (0, 0, 0),
                           (int(balls[pi]["x"]), int(balls[pi]["y"])),
                           balls[pi]["size"], 1)


def setting2(platform, balls):
    addPlatform(platform, 1200, 30, 200, 130)
    addPlatform(platform, 100, 0, 100, 150)

    addBall(balls, 1125, -60, 0, 0, 8, 255, 150, 0)
    addBall(balls, 1140, -80, 0, 0, 9, 255, 255, 255)


def physics(balls, platform, pRad, bounce, gravity, fric, bbounce, win, pCol,
            w, h):
    render(balls, platform, win, pCol, pRad)
    update(balls, platform, pRad, bounce, gravity, fric, bbounce, w, h)


def mainLoop():
    gravity = 0.9
    bounce = 1
    bbounce = 0.9
    pRad = 10
    fric = 1
    pCol = (79, 179, 255)
    w = 1360
    h = 720
    balls = []
    platform = []
    pygame.init()
    init(balls, platform)
    setting2(platform, balls)
    size = (w, h)
    win = pygame.display.set_mode(size)
    pygame.display.set_caption('Physics Engine')
    clock = pygame.time.Clock()
    done = True
    addp = "n"

    while done:
        x, y = pygame.mouse.get_pos()
        win.fill((180, 180, 180))
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LCTRL:
                    x, y = pygame.mouse.get_pos()
                    if addp == "n":
                        x1 = x
                        y1 = y
                        addp = "y"
                    if not (x1 == x) or not (y1 == y):
                        if addp == "y":
                            pygame.draw.line(win, pCol, (x1, y1), (x, y),
                                             pRad * 2)
                            if not (x1 == x) or not (y1 == y):
                                addp = "n"
                                addPlatform(platform, x1, y1, x, y)
                elif event.key == pygame.K_SPACE:
                    x, y = pygame.mouse.get_pos()
                    looping = True
                    i = 0
                    if len(balls) > 0:
                        while ((looping and i <= len(balls))):
                            dx, dy, dist = getV(x, y, balls[i]["x"],
                                                balls[i]["y"])
                            if dist <= balls[i]["size"]:
                                deleteball(balls, i)
                                looping = False
                            i += 1
                            if i == len(balls):
                                break

            elif event.type == pygame.MOUSEBUTTONDOWN:
                x, y = pygame.mouse.get_pos()
                addBall(balls, x, y, 0, 0, random.randint(6, 20),
                        random.randint(0, 255), random.randint(0, 255),
                        random.randint(0, 255))
                dx, dy, dist = getV(x, y, 15, 15)
                if int(dist) < 15:
                    balls = []
                    platform = []

        if addp == "y":
            pygame.draw.line(win, pCol, (x1, y1), (x, y), pRad * 2)
            pygame.draw.circle(win, pCol, (x1, y1), pRad, pRad)
            pygame.draw.circle(win, pCol, (
                x,
                y,
            ), pRad, pRad)

        physics(balls, platform, pRad, bounce, gravity, fric, bbounce, win,
                pCol, w, h)
        pygame.draw.circle(win, (255, 150, 0), (15, 15), 15, 15)
        pygame.display.flip()
        clock.tick(30)
        time.sleep(0.03)


mainLoop()
