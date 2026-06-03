from locust import FastHttpUser, task

class AquilaUser(FastHttpUser):

    @task(4)
    def view_rooms(self):
        self.client.get("/api/rooms")

    @task(2)
    def view_devices(self):
        self.client.get("/api/devices")

    @task(1)
    def send_telemetry(self):
        self.client.post(
            "/api/telemetry",
            json={
                "macAddress": "AA:BB:CC:DD:EE:01", 
                "temperature": 22.5,
                "humidity": 45.0,
                "lightLevel": 300,
                "soundLevel": 20
            }
        )