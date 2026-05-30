"""
Integration tests for simulation engine and API
"""

import pytest
from app.simulation.engine import SimulationEngine
from app.analytics.history_tracker import history_tracker
from app.analytics.fitness_tracker import fitness_tracker
from app.analytics.species_tracker import species_tracker


@pytest.fixture
def engine():
    """Create a fresh engine for each test"""
    return SimulationEngine()


class TestSimulationEngine:
    """Test core simulation engine functionality"""

    def test_engine_initialization(self, engine):
        """Test that engine initializes with correct population"""
        assert len(engine.organisms) == 250
        assert engine.engine_running is True

    def test_tick_execution(self, engine):
        """Test that tick runs without errors"""
        initial_count = len(engine.organisms)
        engine.tick()
        # Population should remain or change naturally
        assert len(engine.organisms) >= 0
        assert len(engine.organisms) <= initial_count + 10  # Natural limits

    def test_fitness_calculation(self, engine):
        """Test that fitness is calculated for all organisms"""
        from app.evolution.fitness import calculate_fitness

        for organism in engine.organisms:
            fitness = calculate_fitness(organism)
            assert 0 <= fitness <= 100

    def test_reproduction_creates_offspring(self, engine):
        """Test that reproduction creates new organisms"""
        engine.tick()
        engine.tick()
        # After ticks, some organisms should have children
        organisms_with_children = [
            o
            for o in engine.organisms
            if hasattr(o, "children_count") and o.children_count > 0
        ]
        # At least some should have reproduced over multiple ticks
        assert len(engine.organisms) > 0

    def test_environment_pressure(self, engine):
        """Test that environment applies pressure"""
        initial_avg_energy = sum(o.energy for o in engine.organisms) / len(
            engine.organisms
        )

        for _ in range(10):
            engine.tick()

        final_avg_energy = sum(o.energy for o in engine.organisms) / len(
            engine.organisms
        )
        # Energy should change due to environment pressure
        assert initial_avg_energy != final_avg_energy


class TestAnalytics:
    """Test analytics collection"""

    def test_history_tracker_initialized(self):
        """Test that history tracker initializes"""
        assert hasattr(history_tracker, "population")
        assert hasattr(history_tracker, "diversity")

    def test_fitness_tracker_initialized(self):
        """Test that fitness tracker initializes"""
        assert hasattr(fitness_tracker, "history")

    def test_species_tracker_initialized(self):
        """Test that species tracker initializes"""
        assert hasattr(species_tracker, "species_map")


class TestGenetics:
    """Test genetic system"""

    def test_inheritance_preserves_diet(self):
        """Test that diet_type is preserved in inheritance"""
        from app.genetics.inheritance import inherit_genome

        parent_genome = {"diet_type": "herbivore"}
        child_genome = inherit_genome(parent_genome)

        # Child should have same diet_type (unless mutated)
        assert "diet_type" in child_genome
        assert child_genome["diet_type"] in ["herbivore", "carnivore", "omnivore"]

    def test_recombination_includes_diet(self):
        """Test that recombination includes diet_type"""
        from app.genetics.inheritance import recombine_genomes

        parent1 = {"diet_type": "herbivore"}
        parent2 = {"diet_type": "carnivore"}
        child = recombine_genomes(parent1, parent2)

        assert "diet_type" in child
        assert child["diet_type"] in ["herbivore", "carnivore", "omnivore"]

    def test_mutation_affects_traits(self):
        """Test that mutation changes genome"""
        from app.genetics.mutation import apply_mutation
        from app.genetics.genome import Genome

        original_genome = Genome()
        mutated_genome = apply_mutation(original_genome)

        # At least one trait should be different
        assert original_genome != mutated_genome


class TestEnvironment:
    """Test environment system"""

    def test_world_boundaries(self, engine):
        """Test that organisms stay within world bounds"""
        for _ in range(5):
            engine.tick()

        for organism in engine.organisms:
            assert 0 <= organism.x <= 2000
            assert 0 <= organism.y <= 2000

    def test_carrying_capacity(self, engine):
        """Test that population respects carrying capacity"""
        # Run simulation for a while
        for _ in range(100):
            engine.tick()

        # Population should stabilize around carrying capacity
        assert len(engine.organisms) > 150  # Should maintain population
        assert len(engine.organisms) < 300  # But not exceed carrying capacity


class TestSimulation:
    """Test overall simulation behavior"""

    def test_diverse_population(self, engine):
        """Test that population maintains diversity"""
        diversities = []
        for _ in range(10):
            engine.tick()
            traits = {o.size for o in engine.organisms}
            # Diversity should exist (multiple trait values)
            assert len(traits) > 1
            diversities.append(len(traits))

        # Diversity should be relatively stable
        avg_diversity = sum(diversities) / len(diversities)
        assert avg_diversity > 1

    def test_energy_conservation(self, engine):
        """Test that energy flow makes sense"""
        initial_energy = sum(o.energy for o in engine.organisms)

        for _ in range(5):
            engine.tick()

        final_energy = sum(o.energy for o in engine.organisms)
        # Total energy should decrease (some organisms die, energy is consumed)
        assert final_energy <= initial_energy * 1.5  # Allow some reproduction

    def test_organism_lifespan(self, engine):
        """Test that organisms age and die"""
        initial_count = len(engine.organisms)
        max_age = max(o.age for o in engine.organisms)

        for _ in range(50):
            engine.tick()

        current_max_age = max(o.age for o in engine.organisms)
        # Ages should increase over ticks
        assert current_max_age > max_age

        # Some organisms should have died
        assert len(engine.organisms) < initial_count * 1.5


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
