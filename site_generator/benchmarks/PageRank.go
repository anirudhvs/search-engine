package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"
)

type Site struct {
	Title      string   `json:"title"`
	Body       string   `json:"body"`
	Links      []int    `json:"links"`
	ParentSite string   `json:"parent_site"`
	SiteURL    string   `json:"site_url"`
	LinkURL    []string `json:"link_urls"`
	Slug       string   `json:"slug"`
	Rank       float64
	Inbound    []int
}

func main() {
	// fmt.Println("Hello, World!")
	jsonFile, err := os.Open("../site_data.json")
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println("opened jsonfile")

	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var sites []Site
	json.Unmarshal(byteValue, &sites)

	// var visited [1000000]int
	// var stack []int
	t1 := time.Now()
	var N int
	N = len(sites)
	var initialRank float64
	initialRank = 1 / float64(N)
	for i := 0; i < len(sites); i++ {
		sites[i].Rank = initialRank
		var sink int = sites[i].Links[0]
		if i != sink {
			sites[sink].Inbound = append(sites[sink].Inbound, i)
		}
		if i == sites[i].Links[0] {
			sites[i].Links = nil
		}
	}
	for i := 0; i < len(sites); i++ {
		//fmt.Println(i, sites[i].Rank, sites[i].Links, sites[i].Inbound)
	}

	var iterations int = 100
	var damping float64 = 0.85
	for iterations > 0 {
		var sum float64 = 0
		var preCalc float64 = (1 - damping) / float64(N)
		var dp float64 = 0
		for i := 0; i < N; i++ {
			if len(sites[i].Links) == 0 {
				//fmt.Println("adding", i, (damping*sites[i].Rank)/float64(N))
				dp += (damping * sites[i].Rank) / float64(N)
			}
		}
		//fmt.Println("precalc", preCalc, "dp", dp)
		for i := 0; i < N; i++ {
			var inboundContribution float64 = 0
			for j := 0; j < len(sites[i].Inbound); j++ {
				//fmt.Println(i, j, sites[i].Inbound[j], sites[sites[i].Inbound[j]].Rank, len(sites[sites[i].Inbound[j]].Links), sites[sites[i].Inbound[j]].Rank/float64(len(sites[sites[i].Inbound[j]].Links)))
				inboundContribution += sites[sites[i].Inbound[j]].Rank / float64(len(sites[sites[i].Inbound[j]].Links))
			}
			//fmt.Println(dp, preCalc, damping, inboundContribution, dp+preCalc, damping*inboundContribution, dp+preCalc+damping*inboundContribution)
			sites[i].Rank = dp + preCalc + damping*inboundContribution
			//fmt.Println("setting", i, sites[i].Rank)
			sum += sites[i].Rank
		}
		//fmt.Println("sum", sum)
		iterations--
	}

	t2 := time.Now()
	elapsed := t2.Sub(t1)
	fmt.Println(elapsed)
}
