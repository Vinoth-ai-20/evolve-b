from collections import defaultdict
from time import perf_counter


class PerformanceProfiler:

    def __init__(self):
        self.metrics = defaultdict(float)
        self.counts = defaultdict(int)

    def record(self, name: str, duration: float):
        self.metrics[name] += duration
        self.counts[name] += 1

    def average(self, name: str):
        count = self.counts[name]

        if count == 0:
            return 0

        return self.metrics[name] / count

    def snapshot(self):
        result = {}

        for key in self.metrics:
            result[key] = {
                "avg_ms": round(
                    self.metrics[key] / max(self.counts[key], 1) * 1000,
                    2,
                ),
                "total_ms": round(
                    self.metrics[key] * 1000,
                    2,
                ),
                "calls": self.counts[key],
            }

        return result

    def reset(self):
        self.metrics.clear()
        self.counts.clear()


profiler = PerformanceProfiler()


class ProfileBlock:

    def __init__(self, name: str):
        self.name = name

    def __enter__(self):
        self.start = perf_counter()

    def __exit__(self, exc_type, exc_val, exc_tb):
        profiler.record(
            self.name,
            perf_counter() - self.start,
        )
