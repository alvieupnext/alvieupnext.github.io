import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-latestpaper',
  imports: [RouterLink],
  templateUrl: './latestpaper.html',
  styleUrl: './latestpaper.css',
})
export class LatestPaper {
  title = "A Systematic Review of Federated Structure Learning: Definitions and Methods";
  abstract = "The paper provides a PRISMA-guided systematic review of Federated Structure Learning (FSL), which encompasses Federated Causal Discovery (FCD) and Federated Bayesian Network Structure Learning (FBNSL). It identifies and categorizes 31 algorithmic contributions, highlighting challenges such as high-dimensional scalability, heterogeneous data fusion, and the integration of cryptographic privacy guarantees.";
  link = "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7066721";
}
