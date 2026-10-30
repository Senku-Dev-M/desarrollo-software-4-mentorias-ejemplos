using FluentAssertions;
using Games.Application.Abstractions.Persistence;
using Games.Application.Games.GetAll;
using Games.Domain.Entities;
using Moq;
using Xunit;

namespace Games.Application.Tests;

public class GetAllGamesUseCaseTests
{
    private readonly Mock<IGameRepository> _repositoryMock;
    private readonly GetAllGamesUseCase _useCase;

    public GetAllGamesUseCaseTests()
    {
        _repositoryMock = new Mock<IGameRepository>();
        _useCase = new GetAllGamesUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnAllGamesMappedToDtos()
    {
        // Arrange
        var games = new List<Game>
        {
            new("Elden Ring", "Action RPG", "FromSoftware", 2022, 59.99m),
            new("Celeste", "Platformer", "Maddy Makes Games", 2018, 19.99m)
        };

        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(games);

        // Act
        var result = await _useCase.ExecuteAsync();

        // Assert
        result.Should().NotBeNull();
        result.Games.Should().HaveCount(2);
        result.Games[0].Name.Should().Be("Elden Ring");
        result.Games[1].Name.Should().Be("Celeste");
    }

    [Fact]
    public async Task ExecuteAsync_WhenNoGamesExist_ShouldReturnEmptyList()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Game>());

        // Act
        var result = await _useCase.ExecuteAsync();

        // Assert
        result.Should().NotBeNull();
        result.Games.Should().BeEmpty();
    }
}
