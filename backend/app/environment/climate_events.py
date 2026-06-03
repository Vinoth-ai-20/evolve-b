import random

from app.analytics.event_tracker import event_tracker


class ClimateEventManager:

    def __init__(self):

        self.active_event = None

        self.end_tick = 0

        self.previous_state = None

    def update(
        self,
        environment,
        tick_count,
    ):

        if self.active_event and tick_count >= self.end_tick:

            if self.previous_state:

                environment.temperature = self.previous_state["temperature"]

                environment.humidity = self.previous_state["humidity"]

                environment.resource_regeneration_rate = self.previous_state[
                    "resource_regeneration_rate"
                ]

            event_tracker.add(
                tick_count,
                "climate",
                f"{self.active_event} ended",
            )

            self.active_event = None

            self.previous_state = None

        if self.active_event is None and tick_count > 0 and tick_count % 500 == 0:

            self.start_random_event(
                environment,
                tick_count,
            )

    def start_random_event(
        self,
        environment,
        tick_count,
    ):

        self.previous_state = {
            "temperature": environment.temperature,
            "humidity": environment.humidity,
            "resource_regeneration_rate": environment.resource_regeneration_rate,
        }

        event = random.choice(
            [
                "Drought",
                "Flood",
                "Heat Wave",
                "Cold Snap",
                "Resource Boom",
            ]
        )

        severity = random.uniform(
            0.5,
            1.5,
        )

        self.active_event = event

        self.end_tick = tick_count + 250

        event_tracker.add(
            tick_count,
            "climate",
            (f"{event} started " f"(severity {severity:.2f})"),
        )

        if event == "Drought":

            environment.humidity *= 0.3 * severity

            environment.resource_regeneration_rate *= 0.25 * severity

        elif event == "Flood":

            environment.humidity = min(
                1.0,
                environment.humidity + (0.4 * severity),
            )

        elif event == "Heat Wave":

            environment.temperature = min(
                1.0,
                environment.temperature + (0.4 * severity),
            )

        elif event == "Cold Snap":

            environment.temperature = max(
                0.0,
                environment.temperature - (0.4 * severity),
            )

        elif event == "Resource Boom":

            environment.resource_regeneration_rate *= 2.0 * severity


climate_event_manager = ClimateEventManager()
