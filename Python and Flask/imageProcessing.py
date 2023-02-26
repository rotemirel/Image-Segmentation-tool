import cv2


class imageProcessing:
    def __init__(self):
        self.image = []
        self.pixels = []

    def set_pixels(self, pixels):
        self.pixels.append(pixels)

    def get_image(self):
        return self.image

    def set_data(self, image):
        self.image.append(image)

    def remove_last_img(self):
        self.image.pop()

    def process_data(self):
        img_copy = self.image[-1].copy()
        edged = canny(img_copy)
        m, n = edged.shape
        for (x, y) in self.pixels[-1]:

            new_x, new_y = find_closest_border(img_copy, edged, x, y)
            image = cv2.circle(img_copy, (new_x, new_y), radius=0, color=(0, 0, 255), thickness=2)

        return image


def canny(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edged = cv2.Canny(gray, 250, 400)

    return edged


def find_closest_border(img, edged, x, y):
    m, n = edged.shape
    max_val = 0
    max_x = max(0, x - 5)
    max_y = max(0, y - 5)
    for i in range(max(0, y - 5), min(m - 1, y + 5)):
        for j in range(max(0, x - 5), min(n - 1, x + 5)):
            distance = abs(x - j) + abs(y - i)
            if edged[i][j] > max_val or (edged[i][j] == max_val and distance < abs(x - max_x) + abs(y - max_y)):
                max_x = j
                max_y = i
                max_val = edged[i][j]
    print(max_val)
    return max_x, max_y

