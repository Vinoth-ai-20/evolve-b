import math
import time


class ClimateSystem:
    def __init__(self):
        self.day_length = 120

    def get_daylight_factor(self) -> float:
        cycle = time.time() / self.day_length

        return (math.sin(cycle) + 1) / 2

    def get_temperature_shift(self) -> float:
        cycle = time.time() / (self.day_length * 4)

        return math.sin(cycle) * 0.4
