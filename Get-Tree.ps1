function Get-Tree {
    param(
        [string]$Path = ".",
        [string]$Indent = ""
    )

    $Exclude = @(
        "node_modules",
        "venv",
        ".git",
        "dist",
        ".vite",
        "__pycache__",
        ".pytest_cache"
    )

    Get-ChildItem $Path |
    Sort-Object @{Expression="PSIsContainer";Descending=$true}, Name |
    ForEach-Object {

        if ($Exclude -contains $_.Name) {
            return
        }

        Write-Output "$Indent|-- $($_.Name)"

        if ($_.PSIsContainer) {
            Get-Tree `
                -Path $_.FullName `
                -Indent "$Indent|   "
        }
    }
}

Get-Tree | Out-File project_structure.txt