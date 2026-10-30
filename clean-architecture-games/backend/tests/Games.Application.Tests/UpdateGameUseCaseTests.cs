using FluentAssertions;
using Games.Application.Abstractions.Persistence;
using Games.Application.Games.Update;
using Games.Domain.Entities;
using Games.Domain.Exceptions;
using Moq;
using Xunit;

namespace Games.Application.Tests;

public class UpdateGameUseCaseTests
{
    private readonly Mock<IGameRepository> _repositoryMock;
    private readonly UpdateGameUseCase _useCase;

    public UpdateGameUseCaseTests()
    {
        _repositoryMock = new Mock<IGameRepository>();
        _useCase = new UpdateGameUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameExists_ShouldUpdateFieldsAndSave()
    {
        // Arrange
        var game = new Game("Cyberpunk 2077", "Action RPG", "CD Projekt Red", 2020, 59.99m);
        _repositoryMock.Setup(r => r.GetByIdAsync(game.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(game);

        var request = new UpdateGameRequest(
            Name: "Cyberpunk 2077: Phantom Liberty",
            Genre: "Action RPG",
            Developer: "CD Projekt Red",
            ReleaseYear: 2023,
            Price: 79.99m
        );

        // Act
        await _useCase.ExecuteAsync(game.Id, request);

        // Assert
        game.Name.Should().Be("Cyberpunk 2077: Phantom Liberty");
        game.ReleaseYear.Should().Be(2023);
        game.Price.Should().Be(79.99m);
        game.UpdatedAt.Should().NotBeNull();

        _repositoryMock.Verify(r => r.UpdateAsync(game, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameDoesNotExist_ShouldThrowEntityNotFoundException()
    {
        // Arrange
        var missingId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(missingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Game?)null);

        var request = new UpdateGameRequest("Name", "Genre", "Dev", 2020, 10);

        // Act
        var act = async () => await _useCase.ExecuteAsync(missingId, request);

        // Assert
        await act.Should().ThrowAsync<EntityNotFoundException>();
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Game>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
