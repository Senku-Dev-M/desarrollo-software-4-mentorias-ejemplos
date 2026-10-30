using FluentAssertions;
using Games.Application.Abstractions.Persistence;
using Games.Application.Games.GetById;
using Games.Domain.Entities;
using Games.Domain.Exceptions;
using Moq;
using Xunit;

namespace Games.Application.Tests;

public class GetGameByIdUseCaseTests
{
    private readonly Mock<IGameRepository> _repositoryMock;
    private readonly GetGameByIdUseCase _useCase;

    public GetGameByIdUseCaseTests()
    {
        _repositoryMock = new Mock<IGameRepository>();
        _useCase = new GetGameByIdUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameExists_ShouldReturnGameResponse()
    {
        // Arrange
        var game = new Game("Hades", "Roguelike", "Supergiant Games", 2020, 24.99m);
        _repositoryMock.Setup(r => r.GetByIdAsync(game.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(game);

        // Act
        var result = await _useCase.ExecuteAsync(game.Id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(game.Id);
        result.Name.Should().Be("Hades");
        result.Genre.Should().Be("Roguelike");
        result.Developer.Should().Be("Supergiant Games");
        result.ReleaseYear.Should().Be(2020);
        result.Price.Should().Be(24.99m);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameDoesNotExist_ShouldThrowEntityNotFoundException()
    {
        // Arrange
        var missingId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(missingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Game?)null);

        // Act
        var act = async () => await _useCase.ExecuteAsync(missingId);

        // Assert
        await act.Should().ThrowAsync<EntityNotFoundException>()
            .WithMessage($"*{missingId}*");
    }
}
