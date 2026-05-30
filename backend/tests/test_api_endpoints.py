"""
API endpoint tests for all REST routes
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


class TestSimulationAPI:
    """Test simulation control endpoints"""

    def test_start_endpoint(self, client):
        """Test /api/simulation/start"""
        response = client.post("/api/simulation/start")
        assert response.status_code == 200

    def test_pause_endpoint(self, client):
        """Test /api/simulation/pause"""
        response = client.post("/api/simulation/pause")
        assert response.status_code == 200

    def test_resume_endpoint(self, client):
        """Test /api/simulation/resume"""
        response = client.post("/api/simulation/resume")
        assert response.status_code == 200

    def test_reset_endpoint(self, client):
        """Test /api/simulation/reset"""
        response = client.post("/api/simulation/reset")
        assert response.status_code == 200

    def test_state_endpoint(self, client):
        """Test /api/simulation/state returns valid state"""
        response = client.get("/api/simulation/state")
        assert response.status_code == 200
        data = response.json()
        assert "tick_count" in data
        assert "organisms" in data
        assert isinstance(data["organisms"], list)

    def test_speed_endpoint(self, client):
        """Test /api/simulation/speed"""
        response = client.post("/api/simulation/speed", json={"speed": 2.0})
        assert response.status_code == 200


class TestAnalyticsAPI:
    """Test analytics endpoints"""

    def test_stats_endpoint(self, client):
        """Test /api/analytics/stats"""
        response = client.get("/api/analytics/stats")
        assert response.status_code == 200
        data = response.json()
        assert "population_count" in data
        assert "diversity" in data
        assert "average_fitness" in data

    def test_history_endpoint(self, client):
        """Test /api/analytics/history"""
        response = client.get("/api/analytics/history")
        assert response.status_code == 200
        data = response.json()
        assert "population_history" in data
        assert "diversity_history" in data

    def test_fitness_endpoint(self, client):
        """Test /api/analytics/fitness"""
        response = client.get("/api/analytics/fitness")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_traits_endpoint(self, client):
        """Test /api/analytics/traits"""
        response = client.get("/api/analytics/traits")
        assert response.status_code == 200
        data = response.json()
        assert "average_size" in data
        assert "average_speed" in data


class TestSpeciesAPI:
    """Test species endpoints"""

    def test_species_list_endpoint(self, client):
        """Test /api/species/"""
        response = client.get("/api/species/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            species = data[0]
            assert "species_id" in species
            assert "count" in species


class TestExportAPI:
    """Test export endpoints"""

    def test_csv_export(self, client):
        """Test /api/export/csv"""
        response = client.get("/api/export/csv")
        assert response.status_code == 200
        assert "text/csv" in response.headers.get("content-type", "")
        assert response.text  # Should have content

    def test_json_export(self, client):
        """Test /api/export/json"""
        response = client.get("/api/export/json")
        assert response.status_code == 200
        assert "application/json" in response.headers.get("content-type", "")
        data = response.json()
        assert "organisms" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
